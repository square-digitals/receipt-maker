export interface ReceiptData {
  // Branding
  logoUrl: string;
  topBarColor: string;

  // Header
  customerName: string;
  greeting: string;
  subGreeting: string;

  // Order info
  orderNumber: string;
  transactionReference: string;

  // Transaction details
  items: string[];
  date: string;
  amount: string;
  orderStatus: string;
  paymentMethod: string;
  transactionId: string;
  cardNumber: string;

  // Footer link
  footerLinkText: string;
  footerLinkUrl: string;

  // Export
  pdfFilename: string;
}

export const defaultReceiptData: ReceiptData = {
  logoUrl: "",
  topBarColor: "#456CA6",

  customerName: "Chisomo",
  greeting: "Hello,",
  subGreeting: "Here is a receipt of your transaction",

  orderNumber: "8760",
  transactionReference: "5678-9012-3546-798",

  items: [
    "Medical Practice Invoice Template",
    "Medical Research Paper Formatting Guide",
    "Pharmaceutical Product Label Template",
    "Telemedicine Consultation Script Template",
  ],
  date: "Wed 14/04/2025 9:00PM",
  amount: "54,588.24 ZMW",
  orderStatus: "Completed",
  paymentMethod: "Card",
  transactionId: "3546798",
  cardNumber: "*****8775",

  footerLinkText: "Visit Website",
  footerLinkUrl: "#",

  pdfFilename: "receipt",
};
