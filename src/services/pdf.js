import jsPDF from "jspdf";
import QRCode from "qrcode";
import toast from "react-hot-toast";

// Convert /public image to Base64
const toBase64 = (url) =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

// PDF generation function
export const generatePdf = async (currentUser, event) => {
  const doc = new jsPDF();

  try {
    // Logos and signature
    const iitpLogo = await toBase64("/iitp-logo.png");
    const anweshaLogo = await toBase64("/A_logo.png");
    const signImg = await toBase64("/sign.png");

    if (iitpLogo) doc.addImage(iitpLogo, "PNG", 15, 10, 30, 30);
    if (anweshaLogo) doc.addImage(anweshaLogo, "PNG", 165, 10, 30, 30);

    // Heading
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text("Anwesha - IIT Patna", 105, 25, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text("Indian Institute of Technology Patna", 105, 32, { align: "center" });
    doc.text("Bihta, Bihar - 801106", 105, 38, { align: "center" });

    // Divider
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.line(20, 44, 190, 44);

    // Receipt Title
    doc.setDrawColor(0);
    doc.setFillColor(220, 230, 255);
    doc.rect(20, 50, 170, 10, "F");
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("Event Registration Receipt", 105, 57, { align: "center" });

    let y = 70;

    // Participant Details
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Participant Details", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${currentUser.personal.firstName} ${currentUser.personal.lastName}`, 20, y);
    y += 7;
    doc.text(`Anwesha ID: ${currentUser.anweshaId}`, 20, y);
    y += 7;
    doc.text(`Email: ${currentUser.email}`, 20, y);
    y += 7;
    doc.text(`Contact: ${currentUser?.contact?.phone || "N/A"}`, 20, y);
    y += 7;
    doc.text(`College: ${currentUser.college?.name || "N/A"}`, 20, y);

    // Event Details
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Event Details", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Event ID: ${event?.eventId || "N/A"}`, 20, y);
    y += 7;
    doc.text(`Team ID: ${event?.teamId || "N/A"}`, 20, y);
    y += 7;
    doc.text(`Payment ID: ${event?.paymentId || "N/A"}`, 20, y);
    y += 7;
    doc.text(`Order ID: ${event?.orderId || "N/A"}`, 20, y);
    y += 7;
    doc.text(`Amount Paid: Rs.${event?.amount || "N/A"}`, 20, y);

    // ✅ QR Code exactly same as website & firebase
    if (currentUser?.qrtoken) {
      // Use the stored qrtoken directly

    //   console.log("Received ",currentUser.qrtoken);
      const qrDataUrl = await QRCode.toDataURL(currentUser.qrtoken, {
        errorCorrectionLevel: "H",
        type: "image/png",
        width: 150,
        margin: 0, // no extra whitespace
        color: {
          dark: "#000000",
          light: "#ffffff"
        }
      });
      doc.addImage(qrDataUrl, "PNG", 145, 80, 50, 50);
      doc.setFontSize(9);
      doc.text("Scan to Verify", 170, 135, { align: "center" });
    }

    // Signature
    if (signImg) doc.addImage(signImg, "PNG", 140, 155, 50, 20);
    doc.setFontSize(10);
    doc.text("Coordinator Signature", 165, 178, { align: "center" });

    // Footer
    const today = new Date().toLocaleDateString();
    doc.setFontSize(9);
    doc.text(`Issued on: ${today}`, 20, 200);
    doc.setTextColor(100);
    doc.text(
      "This receipt is system generated. Please carry a printed or digital copy.",
      105,
      210,
      { align: "center" }
    );

    doc.save(`receipt_${currentUser.anweshaId}_${event?.eventId || "general"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate receipt PDF.");
  }
};
