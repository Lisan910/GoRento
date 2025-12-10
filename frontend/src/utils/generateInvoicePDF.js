import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export const generateInvoicePDF = async (booking) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // HEADER
  doc.setFillColor(245, 245, 247);
  doc.rect(0, 0, 595, 90, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(20, 20, 20);
  doc.text("GoRento", 40, 55);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Premium Vehicle Rentals", 40, 75);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("www.gorento.com", 480, 40, { align: "right" });
  doc.text("support@gorento.com", 480, 55, { align: "right" });

  doc.setDrawColor(200, 200, 200);
  doc.line(0, 90, 595, 90);

  let y = 115;

  // CUSTOMER DETAILS
  doc.setFontSize(14);
  doc.setFont("Helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text("Customer Details", 40, y);

  y += 15;
  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.text(`Name: ${booking.user?.name || "N/A"}`, 40, y);
  y += 15;
  doc.text(`Email: ${booking.user?.email || "N/A"}`, 40, y);
  y += 15;
  doc.text(`Booking ID: ${booking._id}`, 40, y);

  y += 20;
  doc.setDrawColor(230, 230, 230);
  doc.line(40, y, 555, y);
  y += 25;

  // CAR DETAILS
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text("Vehicle Details", 40, y);

  const car = booking.car;
  autoTable(doc, {
    startY: y + 10,
    margin: { left: 40, right: 40 },
    theme: "plain",
    body: [
      ["Make", car.make],
      ["Model", car.model],
      ["Year", car.year],
      ["Transmission", car.transmission],
      ["Price Per Day", `$${car.pricePerDay}`],
    ],
  });

  let vehicleEndY = doc.lastAutoTable.finalY + 25;

  // RENTAL DETAILS
  const start = new Date(booking.startDate);
  const end = new Date(booking.endDate);
  const ms = 1000 * 60 * 60 * 24;
  const diffDays = Math.max(1, Math.ceil((end - start) / ms));

  const pricePerDay = booking?.car?.pricePerDay || 0;
  const total = diffDays * pricePerDay;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Rental Summary", 40, vehicleEndY);

  autoTable(doc, {
    startY: vehicleEndY + 10,
    margin: { left: 40, right: 40 },
    theme: "plain",
    body: [
      ["Start Date", start.toLocaleDateString()],
      ["End Date", end.toLocaleDateString()],
      ["Total Days", diffDays + " day(s)"],
    ],
  });

  let rentEndY = doc.lastAutoTable.finalY + 25;

  // PRICE BREAKDOWN
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Price Breakdown", 40, rentEndY);

  autoTable(doc, {
    startY: rentEndY + 10,
    margin: { left: 40, right: 40 },
    theme: "grid",
    head: [["Description", "Amount"]],
    body: [
      ["Daily Rate", `$${pricePerDay.toFixed(2)}`],
      ["Rental Days", diffDays],
      ["TOTAL", `$${total.toFixed(2)}`],
    ],
    headStyles: { fillColor: [245, 245, 247], textColor: 20 },
    bodyStyles: { textColor: [40, 40, 40] },
  });

  let priceEndY = doc.lastAutoTable.finalY + 30;

  // TERMS
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Terms & Conditions", 40, priceEndY);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);

  const terms = [
    "• Vehicle must be returned in the same condition.",
    "• Late returns may incur additional charges.",
    "• Fuel difference will be charged accordingly.",
    "• Damage or accidents must be reported immediately.",
    "• Customer must verify all details before signing.",
  ];

  let ty = priceEndY + 15;
  terms.forEach((t) => {
    doc.text(t, 40, ty);
    ty += 15;
  });

  // ================================
  // QR CODE
  // ================================
  const qrData = `Booking ID: ${booking._id}\nCustomer: ${booking.user?.name}\nTotal: $${total.toFixed(2)}`;
  const qrUrl = await QRCode.toDataURL(qrData);

  doc.addImage(qrUrl, "PNG", 450, 720, 100, 100); // x, y, width, height

  // FOOTER
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for choosing GoRento!", 297, 820, { align: "center" });

  doc.save(`GoRento_Invoice_${booking._id}.pdf`);
};
