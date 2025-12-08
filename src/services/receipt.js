import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Card, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Receipt = ({ user, payment }) => {
  const receiptRef = useRef();

  // ✅ QR Code secret data
  const qrData = JSON.stringify({
    name: user.name,
    email: user.email,
    amount: payment.amount,
    txnId: payment.transactionId,
    secret: "ANWSH2025-IITP-KEY",
  });

  // ✅ Download as PDF
  const handleDownloadReceipt = async () => {
    const element = receiptRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true, // ✅ Ensures CORS-safe image rendering
      allowTaint: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const margin = 10;
    pdf.addImage(imgData, "PNG", margin, margin, pdfWidth - 2 * margin, pdfHeight - 2 * margin);

    const filename = `Anwesha_Receipt_${user.name.replace(/\s+/g, "_")}.pdf`;
    pdf.save(filename);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div ref={receiptRef} className="w-full max-w-3xl">
        <Card className="shadow-xl rounded-2xl border border-gray-300 bg-white">
          <CardContent className="p-8">
            {/* Header with Logos */}
            <div className="flex justify-between items-center mb-6">
              <img
                src="/iitp-logo.png"
                alt="IIT Patna Logo"
                className="h-16"
                crossOrigin="anonymous"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold">Anwesha 2025</h1>
                <p className="text-sm text-gray-600">
                  Indian Institute of Technology, Patna
                </p>
                <p className="text-xs text-gray-500">
                  Bihta, Patna - 801106, Bihar, India
                </p>
              </div>
              <img
                src="/anwesha-logo.png"
                alt="Anwesha Logo"
                className="h-16"
                crossOrigin="anonymous"
              />
            </div>

            {/* Divider */}
            <hr className="border-gray-300 mb-6" />

            {/* Receipt Title */}
            <h2 className="text-xl font-semibold text-center mb-4">
              Payment Receipt
            </h2>

            {/* User + Payment Info */}
            <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
              <div>
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Amount Paid:</span> ₹
                  {payment.amount}
                </p>
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {payment.transactionId}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {payment.date}
                </p>
              </div>
            </div>

            {/* QR Code + Signature Row */}
            <div className="flex justify-between items-center mt-8">
              {/* QR Code */}
              <div className="text-center">
                <QRCode value={qrData} size={100} />
                <p className="text-xs text-gray-500 mt-2">Scan to Verify</p>
              </div>

              {/* Signature */}
              <div className="text-center">
                <div className="h-12 w-40 border-b border-gray-500 mx-auto"></div>
                <p className="text-sm mt-1 text-gray-700">Authorized Signature</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>
                This receipt is computer generated and does not require a physical seal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadReceipt}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Receipt;
