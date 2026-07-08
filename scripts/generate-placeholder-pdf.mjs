/**
 * Placeholder PDF Generator for Nyaera Ogega & Co. Advocates
 * 
 * Generates a generic 1-page placeholder PDF for documents that don't
 * have a specific PDF file yet.
 * 
 * Run with: node scripts/generate-placeholder-pdf.mjs
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'documents');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'placeholder.pdf');

async function generatePlaceholder() {
  console.log('📄 Generating placeholder PDF...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  const margin = 72;
  const contentWidth = width - 2 * margin;

  // ── Header line ──
  page.drawLine({
    start: { x: margin, y: height - 50 },
    end: { x: width - margin, y: height - 50 },
    thickness: 2,
    color: rgb(0.18, 0.19, 0.57),
  });

  // ── Firm Name / Logo area ──
  page.drawText('NYAERA OGEGA & CO. ADVOCATES', {
    x: margin,
    y: height - 90,
    size: 16,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  page.drawText('Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi', {
    x: margin,
    y: height - 110,
    size: 9,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText('info@nyaeraogegaadvocates.com', {
    x: margin,
    y: height - 125,
    size: 9,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // ── Decorative separator ──
  page.drawLine({
    start: { x: margin, y: height - 145 },
    end: { x: width - margin, y: height - 145 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });

  // ── Main content ──
  const contentY = height - 200;

  // Document icon / placeholder visual
  page.drawRectangle({
    x: width / 2 - 40,
    y: contentY - 20,
    width: 80,
    height: 100,
    color: rgb(0.95, 0.95, 0.98),
    borderColor: rgb(0.18, 0.19, 0.57),
    borderWidth: 2,
  });

  // Lines inside the "document" icon
  for (let i = 0; i < 4; i++) {
    page.drawLine({
      start: { x: width / 2 - 25, y: contentY + 65 - i * 18 },
      end: { x: width / 2 + 25, y: contentY + 65 - i * 18 },
      thickness: 2,
      color: rgb(0.18, 0.19, 0.57),
    });
  }

  // ── Placeholder text ──
  const placeholderText = 'This is a placeholder document.';
  const placeholderText2 = 'The actual document will be drafted by';
  const placeholderText3 = 'Nyaera Ogega & Co. Advocates.';

  const text1Width = fontBold.widthOfTextAtSize(placeholderText, 18);
  page.drawText(placeholderText, {
    x: (width - text1Width) / 2,
    y: contentY - 60,
    size: 18,
    font: fontBold,
    color: rgb(0.18, 0.19, 0.57),
  });

  const text2Width = font.widthOfTextAtSize(placeholderText2, 14);
  page.drawText(placeholderText2, {
    x: (width - text2Width) / 2,
    y: contentY - 90,
    size: 14,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const text3Width = fontBold.widthOfTextAtSize(placeholderText3, 16);
  page.drawText(placeholderText3, {
    x: (width - text3Width) / 2,
    y: contentY - 120,
    size: 16,
    font: fontBold,
    color: rgb(0.67, 0.51, 0.17), // Gold accent
  });

  // ── Footer line ──
  page.drawLine({
    start: { x: margin, y: 55 },
    end: { x: width - margin, y: 55 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText('Nyaera Ogega & Co. Advocates | Shelter Afrique Building, Mamlaka Road, 3rd Floor, Room 4, Nairobi | info@nyaeraogegaadvocates.com', {
    x: margin,
    y: 40,
    size: 7,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText('PLACEHOLDER DOCUMENT', {
    x: width - margin - 120,
    y: 40,
    size: 7,
    font: fontBold,
    color: rgb(0.8, 0.2, 0.2),
  });

  // ── Save ──
  const pdfBytes = await doc.save();
  fs.writeFileSync(OUTPUT_FILE, pdfBytes);
  const sizeKB = (pdfBytes.length / 1024).toFixed(1);

  console.log(`  ✅ Saved: placeholder.pdf (${sizeKB} KB)`);
  console.log(`   Output: ${OUTPUT_FILE}`);
}

generatePlaceholder().catch(console.error);
