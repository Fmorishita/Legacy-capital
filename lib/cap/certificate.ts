import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, degrees, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";

// Certificado en carta horizontal con la identidad del brandbook: navy #1A2B4C, oro #C5A564,
// EB Garamond para títulos y Montserrat para textos.

const NAVY = rgb(0x1a / 255, 0x2b / 255, 0x4c / 255);
const GOLD = rgb(0xc5 / 255, 0xa5 / 255, 0x64 / 255);
const GOLD_DK = rgb(0x85 / 255, 0x66 / 255, 0x2a / 255);
const INK = rgb(0x3a / 255, 0x46 / 255, 0x60 / 255);
const MUTED = rgb(0x64 / 255, 0x6e / 255, 0x80 / 255);
const CREAM = rgb(0xfb / 255, 0xf8 / 255, 0xf2 / 255);

const FONTS = path.join(process.cwd(), "lib/cap/fonts");

const fecha = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Tijuana" }).format(new Date(iso));

function centered(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = NAVY, spacing = 0) {
  const width = font.widthOfTextAtSize(text, size) + spacing * Math.max(text.length - 1, 0);
  const { width: W } = page.getSize();
  if (!spacing) return page.drawText(text, { x: (W - width) / 2, y, size, font, color });
  let x = (W - width) / 2;
  for (const ch of text) {
    page.drawText(ch, { x, y, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + spacing;
  }
}

/** Ajusta el tamaño para que el texto quepa en `max` puntos de ancho. */
function fit(font: PDFFont, text: string, size: number, max: number) {
  const w = font.widthOfTextAtSize(text, size);
  return w > max ? (size * max) / w : size;
}

export async function certificatePdf(opts: { nombre: string; folio: string; emitido_at: string; verifyUrl: string; logo?: Uint8Array }) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Certificado ${opts.folio} · Legacy Capital`);
  pdf.setAuthor("Legacy Capital Real Estate");
  pdf.setSubject("Certificado de finalización · Curso de Ventas Inmobiliarias");
  pdf.setCreator("Legacy Capital");

  // EB Garamond pierde glifos al generar subconjuntos con fontkit: se incrusta completa
  const [serif, serifItalic, sans, sansBold] = await Promise.all(
    [
      ["EBGaramond_500Medium.ttf", false],
      ["EBGaramond_400Regular_Italic.ttf", false],
      ["Montserrat_500Medium.ttf", true],
      ["Montserrat_600SemiBold.ttf", true],
    ].map(async ([f, subset]) => pdf.embedFont(await readFile(path.join(FONTS, f as string)), { subset: subset as boolean })),
  );

  const page = pdf.addPage([792, 612]);
  const { width: W, height: H } = page.getSize();

  // Fondo y marcos
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: NAVY, borderWidth: 7 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: GOLD, borderWidth: 0.9 });
  page.drawRectangle({ x: 36, y: 36, width: W - 72, height: H - 72, borderColor: GOLD, borderWidth: 0.4 });
  // Esquinas en rombo dorado
  for (const [x, y] of [
    [36, 36],
    [W - 36, 36],
    [36, H - 36],
    [W - 36, H - 36],
  ]) {
    const s = 7;
    page.drawSquare({ x, y: y - (s * Math.SQRT2) / 2, size: s, color: GOLD, rotate: degrees(45) });
  }

  // Logotipo
  let top = H - 64;
  if (opts.logo) {
    const img = await pdf.embedPng(opts.logo);
    const w = 150;
    const h = (img.height / img.width) * w;
    page.drawImage(img, { x: (W - w) / 2, y: top - h, width: w, height: h });
    top -= h + 26;
  } else {
    centered(page, "LEGACY CAPITAL", top - 30, serif, 30, NAVY, 2);
    top -= 60;
  }

  centered(page, "CERTIFICADO DE FINALIZACIÓN", top - 6, sansBold, 12.5, GOLD_DK, 3.2);
  const lineY = top - 20;
  page.drawLine({ start: { x: W / 2 - 60, y: lineY }, end: { x: W / 2 + 60, y: lineY }, thickness: 0.8, color: GOLD });

  centered(page, "Se otorga a", lineY - 38, serifItalic, 16, MUTED);
  const nameSize = fit(serif, opts.nombre, 44, W - 200);
  centered(page, opts.nombre, lineY - 38 - 52, serif, nameSize, NAVY);
  page.drawLine({ start: { x: 160, y: lineY - 106 }, end: { x: W - 160, y: lineY - 106 }, thickness: 0.6, color: GOLD });

  centered(page, "por haber concluido satisfactoriamente el", lineY - 134, sans, 10.5, INK);
  centered(page, "Curso de Ventas Inmobiliarias · Legacy Capital", lineY - 162, serif, 21, NAVY);
  centered(page, "y aprobado su evaluación final.", lineY - 184, sans, 10.5, INK);

  // Pie: fecha · firma · verificación
  const baseY = 88;
  const colW = 190;
  // Fecha
  const leftX = 78;
  page.drawText(fecha(opts.emitido_at), { x: leftX, y: baseY + 16, size: 11, font: serif, color: NAVY });
  page.drawLine({ start: { x: leftX, y: baseY + 8 }, end: { x: leftX + colW - 20, y: baseY + 8 }, thickness: 0.6, color: GOLD });
  page.drawText("FECHA DE EMISIÓN", { x: leftX, y: baseY - 6, size: 7, font: sansBold, color: MUTED });
  page.drawText(`Folio ${opts.folio}`, { x: leftX, y: baseY - 20, size: 8.5, font: sans, color: INK });

  // Firma
  const midX = W / 2 - colW / 2;
  const sig = "Fran Morishita";
  page.drawText(sig, {
    x: W / 2 - serifItalic.widthOfTextAtSize(sig, 22) / 2,
    y: baseY + 14,
    size: 22,
    font: serifItalic,
    color: NAVY,
  });
  page.drawLine({ start: { x: midX, y: baseY + 8 }, end: { x: midX + colW, y: baseY + 8 }, thickness: 0.6, color: GOLD });
  centered(page, "FRAN MORISHITA", baseY - 6, sansBold, 7, MUTED, 0.6);
  centered(page, "Legacy Capital", baseY - 20, sans, 8.5, INK);

  // QR de verificación
  const qr = QRCode.create(opts.verifyUrl, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const qrSize = 62;
  const cell = qrSize / n;
  const qx = W - 78 - qrSize;
  const qy = baseY - 22;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) page.drawRectangle({ x: qx + c * cell, y: qy + (n - 1 - r) * cell, width: cell + 0.02, height: cell + 0.02, color: NAVY });
    }
  }
  const verifyLabel = "VERIFICA ESTE CERTIFICADO";
  page.drawText(verifyLabel, { x: qx - 8 - sansBold.widthOfTextAtSize(verifyLabel, 6.5), y: qy + 34, size: 6.5, font: sansBold, color: MUTED });
  // URL en dos renglones para no invadir la columna de la firma
  const short = opts.verifyUrl.replace(/^https?:\/\//, "");
  const cut = short.indexOf("/");
  const lines = cut > 0 ? [short.slice(0, cut), short.slice(cut)] : [short];
  lines.forEach((ln, i) => {
    const size = fit(sans, ln, 7.5, 135);
    page.drawText(ln, { x: qx - 8 - sans.widthOfTextAtSize(ln, size), y: qy + 22 - i * 10, size, font: sans, color: INK });
  });

  centered(page, "Building wealth for generations.", 46, serifItalic, 10, GOLD_DK);

  return pdf.save();
}
