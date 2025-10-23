// src/pdf-service/utils.ts

import type jsPDF from 'jspdf';

/**
 * Utilidades para la generación de PDFs
 */

/**
 * Formatea una fecha de manera legible en español
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Divide texto largo en líneas que caben en el ancho especificado
 */
export function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = pdf.getTextWidth(testLine);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Genera un nombre de archivo seguro basado en el título
 */
export function generateSafeFilename(title: string): string {
  const date = new Date().toISOString().split('T')[0];
  const safeName = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);

  return `relato-${safeName}-${date}.pdf`;
}

/**
 * Convierte un color hex a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Divide contenido en páginas según altura disponible
 */
export function splitTextIntoPages(
  pdf: jsPDF,
  text: string,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number
): string[][] {
  const paragraphs = text.split('\n\n').filter((p) => p.trim());
  const pages: string[][] = [];
  let currentPage: string[] = [];
  let currentHeight = 0;

  paragraphs.forEach((paragraph) => {
    const lines = wrapText(pdf, paragraph.trim(), maxWidth);

    lines.forEach((line) => {
      if (currentHeight + lineHeight > maxHeight) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(line);
      currentHeight += lineHeight;
    });

    // Espacio entre párrafos
    currentHeight += lineHeight * 0.5;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
}

/**
 * Calcula el número total de páginas necesarias
 */
export function calculateTotalPages(
  pdf: jsPDF,
  text: string,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number
): number {
  const pages = splitTextIntoPages(pdf, text, maxWidth, maxHeight, lineHeight);
  return pages.length;
}