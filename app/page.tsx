"use client";

import React, { useState, useRef } from "react";
import ReceiptPreview from "./components/ReceiptPreview";
import ReceiptEditor from "./components/ReceiptEditor";
import { ReceiptData, defaultReceiptData } from "./types";

export default function Home() {
  const [receiptData, setReceiptData] = useState<ReceiptData>(defaultReceiptData);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const el = document.getElementById("receipt-preview");
    if (!el) return;

    // Dynamic import to avoid SSR issues
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#efefef",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit A4
    const canvasAspect = canvas.height / canvas.width;
    const imgWidth = pageWidth;
    const imgHeight = imgWidth * canvasAspect;

    // Center vertically if shorter than page
    const yOffset = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 0;

    pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
    pdf.save("receipt.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Receipt Maker</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Customize your receipt and export as PDF
            </p>
          </div>
          <div className="text-xs text-gray-400 hidden md:block">
            Changes appear instantly in the preview →
          </div>
        </div>
      </header>

      {/* Main two-panel layout */}
      <main className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Receipt Preview */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-3 self-start uppercase tracking-widest font-semibold">
            Preview
          </div>
          <div ref={previewRef} className="w-full overflow-x-auto">
            <div
              style={{
                backgroundColor: "#efefef",
                padding: "30px 20px",
                minWidth: "640px",
              }}
            >
              <ReceiptPreview data={receiptData} />
            </div>
          </div>
        </div>

        {/* Right: Editor */}
        <div
          className="w-full lg:w-[380px] xl:w-[420px] shrink-0"
          style={{ position: "sticky", top: "16px", maxHeight: "calc(100vh - 100px)" }}
        >
          <div className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">
            Settings
          </div>
          <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            <ReceiptEditor
              data={receiptData}
              onChange={setReceiptData}
              onDownloadPDF={handleDownloadPDF}
              onPrint={handlePrint}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
