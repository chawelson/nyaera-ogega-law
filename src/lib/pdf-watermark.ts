import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

export interface WatermarkInfo {
  buyerName: string;
  buyerEmail: string;
  date: string;
  transactionId: string;
}

/**
 * Adds a digital watermark to a PDF with buyer's name, email, and date.
 * Also adds a footer with the transaction ID.
 */
export async function addWatermarkToPdf(
  pdfFilePath: string,
  watermark: WatermarkInfo
): Promise<Uint8Array> {
  // Read the original PDF file
  const fullPath = path.join(process.cwd(), 'public', pdfFilePath);
  const pdfBytes = await fs.readFile(fullPath);

  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();

    // ── Diagonal watermark text ──
    const watermarkText = `PURCHASED BY: ${watermark.buyerName} | ${watermark.buyerEmail} | ${watermark.date}`;
    const fontSize = 10;
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

    // Draw diagonal watermark across the page (multiple lines for coverage)
    const spacing = 120;
    const angle = Math.atan2(height, width);

    for (let i = -5; i < 10; i++) {
      const offset = i * spacing;
      const x = offset * Math.cos(angle);
      const y = offset * Math.sin(angle);

      page.drawText(watermarkText, {
        x: x + 50,
        y: y + 50,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.3,
        rotate: degrees(25),
      });
    }

    // ── Header watermark ──
    page.drawText('PURCHASED DOCUMENT', {
      x: 50,
      y: height - 40,
      size: 12,
      font: fontBold,
      color: rgb(0.7, 0.2, 0.2),
      opacity: 0.6,
    });

    // ── Footer with buyer info ──
    const footerY = 30;
    page.drawText(`Purchased by: ${watermark.buyerName}`, {
      x: 50,
      y: footerY,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
    page.drawText(`Email: ${watermark.buyerEmail}`, {
      x: 50,
      y: footerY - 12,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
    page.drawText(`Date: ${watermark.date}`, {
      x: 50,
      y: footerY - 24,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });

    // Transaction ID on the right side of footer
    const txnText = `TXN: ${watermark.transactionId}`;
    const txnWidth = font.widthOfTextAtSize(txnText, 8);
    page.drawText(txnText, {
      x: width - txnWidth - 50,
      y: footerY,
      size: 8,
      font,
      color: rgb(0.3, 0.3, 0.3),
      opacity: 0.7,
    });
  }

  // Save the watermarked PDF
  const watermarkedPdf = await pdfDoc.save();
  return watermarkedPdf;
}

/**
 * Creates a sample/preview PDF with 'SAMPLE' watermark on first 2 pages.
 */
export async function createSamplePreview(
  pdfFilePath: string
): Promise<Uint8Array> {
  const fullPath = path.join(process.cwd(), 'public', pdfFilePath);
  const pdfBytes = await fs.readFile(fullPath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  // Only watermark first 2 pages with SAMPLE
  const pagesToWatermark = Math.min(2, pages.length);
  for (let i = 0; i < pagesToWatermark; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    // Large diagonal SAMPLE watermark
    const sampleText = 'SAMPLE';
    const fontSize = 72;

    // Draw multiple SAMPLE watermarks diagonally
    for (let row = -2; row < 4; row++) {
      for (let col = -2; col < 4; col++) {
        page.drawText(sampleText, {
          x: col * 250 + row * 50,
          y: row * 250 + col * 50,
          size: fontSize,
          font,
          color: rgb(0.8, 0.2, 0.2),
          opacity: 0.15,
          rotate: degrees(45),
        });
      }
    }

    // Red SAMPLE banner at top
    page.drawRectangle({
      x: 0,
      y: height - 60,
      width,
      height: 60,
      color: rgb(0.8, 0.1, 0.1),
      opacity: 0.7,
    });
    page.drawText('SAMPLE — NOT FOR USE', {
      x: width / 2 - 120,
      y: height - 42,
      size: 20,
      font,
      color: rgb(1, 1, 1),
      opacity: 0.9,
    });
  }

  // If more than 2 pages, remove the rest
  while (pdfDoc.getPageCount() > 2) {
    pdfDoc.removePage(pdfDoc.getPageCount() - 1);
  }

  return await pdfDoc.save();
}
