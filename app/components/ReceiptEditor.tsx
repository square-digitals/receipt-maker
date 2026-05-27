"use client";

import React, { useRef } from "react";
import { ReceiptData } from "../types";

// Generate a random order number (4-5 digits)
function randomOrderNumber() {
  return String(Math.floor(1000 + Math.random() * 90000));
}

// Generate a random transaction reference like XXXX-XXXX-XXXX-XXXX
function randomTxRef() {
  const seg = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

// Convert a datetime-local string ("2025-04-14T21:00") to "Wed 14/04/2025 9:00PM"
function formatDatetime(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[d.getDay()];
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${dd}/${mm}/${yyyy} ${hours}:${minutes}${ampm}`;
}

// Convert "Wed 14/04/2025 9:00PM" back to "2025-04-14T21:00" for the picker
function parseDateToISO(formatted: string): string {
  // Match: "Wed 14/04/2025 9:00PM" or "Wed 14/04/2025 9:00 PM"
  const m = formatted.match(
    /\w+\s+(\d{2})\/(\d{2})\/(\d{4})\s+(\d+):(\d{2})\s*(AM|PM)/i
  );
  if (!m) return "";
  const [, dd, mo, yyyy, hRaw, min, ampm] = m;
  let h = parseInt(hRaw, 10);
  if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
  if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
  const hh = String(h).padStart(2, "0");
  return `${yyyy}-${mo}-${dd}T${hh}:${min}`;
}

interface Props {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  onDownloadPDF: () => void;
  onPrint: () => void;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  type?: string;
}) {
  const base =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={`${base} resize-y min-h-[80px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className={base}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-200 pb-1">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function ReceiptEditor({
  data,
  onChange,
  onDownloadPDF,
  onPrint,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ReceiptData, value: ReceiptData[keyof ReceiptData]) =>
    onChange({ ...data, [key]: value });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      set("logoUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleItemsChange = (raw: string) => {
    // Split on newlines — preserve spaces so the user can type freely
    set("items", raw.split("\n"));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Actions */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={onDownloadPDF}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          ⬇ Download PDF
        </button>
        <button
          onClick={onPrint}
          className="flex-1 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          🖨 Print
        </button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {/* Branding */}
        <Section title="Branding">
          {/* Logo Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Logo
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt="Logo preview"
                  className="max-h-16 mx-auto object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm">
                  <div className="text-2xl mb-1">📁</div>
                  Click to upload logo
                  <div className="text-xs mt-1 text-gray-400">
                    PNG, JPG, SVG, WEBP
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {data.logoUrl && (
              <button
                onClick={() => set("logoUrl", "")}
                className="text-xs text-red-500 hover:text-red-700 self-start"
              >
                Remove logo
              </button>
            )}
          </div>

          {/* Top Bar Color */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Top Bar Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={data.topBarColor}
                onChange={(e) => set("topBarColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300 p-0.5 bg-white"
              />
              <input
                type="text"
                value={data.topBarColor}
                onChange={(e) => set("topBarColor", e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 font-mono"
                placeholder="#456CA6"
              />
            </div>
            {/* Presets */}
            <div className="flex gap-1.5 flex-wrap mt-1">
              {[
                "#456CA6",
                "#1a73e8",
                "#34a853",
                "#ea4335",
                "#fbbc05",
                "#8b5cf6",
                "#f97316",
                "#0f172a",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => set("topBarColor", c)}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* Header */}
        <Section title="Header">
          <Field
            label="Greeting"
            value={data.greeting}
            onChange={(v) => set("greeting", v)}
            placeholder="Hello,"
          />
          <Field
            label="Customer Name"
            value={data.customerName}
            onChange={(v) => set("customerName", v)}
            placeholder="Chisomo"
          />
          <Field
            label="Sub-greeting"
            value={data.subGreeting}
            onChange={(v) => set("subGreeting", v)}
            placeholder="Here is a receipt of your transaction"
          />
        </Section>

        {/* Order Info */}
        <Section title="Order Info">
          {/* Order Number + generate button */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Order Number
              </label>
              <button
                onClick={() => set("orderNumber", randomOrderNumber())}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                title="Generate random order number"
              >
                ↺ Generate
              </button>
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              value={data.orderNumber}
              onChange={(e) => set("orderNumber", e.target.value)}
              placeholder="8760"
            />
          </div>

          {/* Transaction Reference + generate button */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Transaction Reference
              </label>
              <button
                onClick={() => set("transactionReference", randomTxRef())}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                title="Generate random reference"
              >
                ↺ Generate
              </button>
            </div>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              value={data.transactionReference}
              onChange={(e) => set("transactionReference", e.target.value)}
              placeholder="5678-9012-3546-798"
            />
          </div>
        </Section>

        {/* Transaction Details */}
        <Section title="Transaction Details">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Item(s) Purchased
              <span className="ml-1 normal-case font-normal text-gray-400">
                (one per line)
              </span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 resize-y min-h-[100px]"
              value={data.items.join("\n")}
              onChange={(e) => handleItemsChange(e.target.value)}
              placeholder={"Item 1\nItem 2\nItem 3"}
            />
          </div>
          {/* Date — picker + formatted display */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Date
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              value={parseDateToISO(data.date)}
              onChange={(e) => set("date", formatDatetime(e.target.value))}
            />
            {data.date && (
              <p className="text-xs text-gray-400 mt-0.5">
                Preview: <span className="text-gray-600 font-medium">{data.date}</span>
              </p>
            )}
          </div>
          <Field
            label="Amount"
            value={data.amount}
            onChange={(v) => set("amount", v)}
            placeholder="54,588.24 ZMW"
          />
          <Field
            label="Order Status"
            value={data.orderStatus}
            onChange={(v) => set("orderStatus", v)}
            placeholder="Completed"
          />
          <Field
            label="Payment Method"
            value={data.paymentMethod}
            onChange={(v) => set("paymentMethod", v)}
            placeholder="Card"
          />
          <Field
            label="Transaction ID"
            value={data.transactionId}
            onChange={(v) => set("transactionId", v)}
            placeholder="3546798"
          />
          <Field
            label="Card Number"
            value={data.cardNumber}
            onChange={(v) => set("cardNumber", v)}
            placeholder="*****8775"
          />
        </Section>

        {/* Footer */}
        <Section title="Footer Link">
          <Field
            label="Link Text"
            value={data.footerLinkText}
            onChange={(v) => set("footerLinkText", v)}
            placeholder="Visit Website"
          />
          <Field
            label="Link URL"
            value={data.footerLinkUrl}
            onChange={(v) => set("footerLinkUrl", v)}
            placeholder="https://example.com"
          />
        </Section>
      </div>
    </div>
  );
}
