"use client";

import React, { useRef } from "react";
import { ReceiptData } from "../types";

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
    // Each non-empty line = one item
    const items = raw.split("\n").map((s) => s.trim());
    set("items", items);
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
          <Field
            label="Order Number"
            value={data.orderNumber}
            onChange={(v) => set("orderNumber", v)}
            placeholder="8760"
          />
          <Field
            label="Transaction Reference"
            value={data.transactionReference}
            onChange={(v) => set("transactionReference", v)}
            placeholder="5678-9012-3546-798"
          />
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
          <Field
            label="Date"
            value={data.date}
            onChange={(v) => set("date", v)}
            placeholder="Wed 14/04/2025 9:00PM"
          />
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
