"use client";

import React from "react";
import { ReceiptData } from "../types";

interface Props {
  data: ReceiptData;
}

export default function ReceiptPreview({ data }: Props) {
  const rows = [
    { label: "Item(s) Purchased", value: data.items.join(",\n") },
    { label: "Date", value: data.date },
    { label: "Amount", value: data.amount },
    { label: "Order Status", value: data.orderStatus },
    { label: "Payment Method", value: data.paymentMethod },
    { label: "Transaction ID", value: data.transactionId },
    { label: "Card Number", value: data.cardNumber },
  ];

  return (
    <div
      id="receipt-preview"
      style={{
        backgroundColor: "#efefef",
        padding: "0",
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
      }}
    >
      <table
        cellSpacing="0"
        cellPadding="0"
        style={{
          borderCollapse: "collapse",
          borderSpacing: 0,
          backgroundColor: "#ffffff",
          width: "600px",
          margin: "0 auto",
        }}
      >
        {/* Top Color Bar */}
        <tbody>
          <tr>
            <td
              style={{
                padding: "20px 20px 0 20px",
                backgroundColor: data.topBarColor,
                height: "20px",
              }}
            >
              &nbsp;
            </td>
          </tr>

          {/* Logo Row */}
          <tr>
            <td style={{ padding: "50px 50px 10px 50px", textAlign: "center" }}>
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt="Logo"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    maxWidth: "245px",
                    maxHeight: "80px",
                    objectFit: "contain",
                    border: 0,
                    outline: "none",
                    textDecoration: "none",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "245px",
                    height: "60px",
                    margin: "0 auto",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: "13px",
                    border: "1px dashed #ccc",
                    borderRadius: "4px",
                  }}
                >
                  Your Logo Here
                </div>
              )}
            </td>
          </tr>

          {/* Title: Transaction Receipt */}
          <tr>
            <td style={{ padding: "2px 20px 5px 20px", textAlign: "center" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                  lineHeight: "24px",
                  color: "#333333",
                  fontSize: "16px",
                }}
              >
                Transaction Receipt
              </p>
            </td>
          </tr>

          {/* Greeting */}
          <tr>
            <td style={{ padding: "0 20px 0 20px" }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                  lineHeight: "24px",
                  color: "#333333",
                  fontSize: "16px",
                }}
              >
                <strong>
                  {data.greeting} {data.customerName}
                </strong>
              </p>
              {data.subGreeting && (
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontFamily:
                      "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                    lineHeight: "21px",
                    color: "#333333",
                    fontSize: "14px",
                  }}
                >
                  {data.subGreeting}
                </p>
              )}
            </td>
          </tr>

          {/* Order info */}
          <tr>
            <td style={{ padding: "20px 20px 0 20px" }}>
              {data.orderNumber && (
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontFamily:
                      "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                    lineHeight: "21px",
                    color: "#333333",
                    fontSize: "14px",
                  }}
                >
                  <strong>Order Number: {data.orderNumber}</strong>
                </p>
              )}
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                  lineHeight: "21px",
                  color: "#333333",
                  fontSize: "14px",
                }}
              >
                <strong>
                  Transaction Reference: {data.transactionReference}
                </strong>
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                  lineHeight: "21px",
                  color: "#333333",
                  fontSize: "14px",
                }}
              >
                <strong>Transaction Details:</strong>
              </p>
            </td>
          </tr>

          {/* Detail Rows */}
          {rows.map(({ label, value }, i) => (
            <tr key={label}>
              <td
                style={{
                  padding: `${i === 0 ? "10px" : "5px"} 20px 0 20px`,
                }}
              >
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    borderCollapse: "collapse",
                    width: "560px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: "270px",
                          verticalAlign: "top",
                          fontFamily:
                            "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                          lineHeight: "21px",
                          color: "#333333",
                          fontSize: "14px",
                        }}
                      >
                        {label}
                      </td>
                      <td style={{ width: "20px" }} />
                      <td
                        style={{
                          width: "270px",
                          textAlign: "right",
                          verticalAlign: "top",
                          fontFamily:
                            "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                          lineHeight: "21px",
                          color: "#333333",
                          fontSize: "14px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}

          {/* Footer Link */}
          <tr>
            <td
              style={{
                padding: "30px 20px 50px 20px",
                textAlign: "center",
              }}
            >
              <a
                href={data.footerLinkUrl || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                  fontSize: "16px",
                  color: "#333333",
                  padding: "10px 20px",
                  display: "inline-block",
                  textDecoration: "underline",
                  lineHeight: "19.2px",
                }}
              >
                {data.footerLinkText || "Visit Website"}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
