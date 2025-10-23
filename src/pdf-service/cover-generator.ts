// src/pdf-service/cover-generator.ts

import type jsPDF from 'jspdf';

/**
 * Servicio para generar portadas decorativas
 */
export class CoverGenerator {
  /**
   * Añade ilustración decorativa a la portada
   */
  static addIllustration(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    style: 'stars' | 'geometric' | 'simple'
  ): void {
    switch (style) {
      case 'stars':
        this.drawStars(pdf, pageWidth, pageHeight);
        break;
      case 'geometric':
        this.drawGeometric(pdf, pageWidth, pageHeight);
        break;
      case 'simple':
        this.drawSimple(pdf, pageWidth, pageHeight);
        break;
    }
  }

  /**
   * Dibuja estrellas decorativas
   */
  private static drawStars(pdf: jsPDF, width: number, height: number): void {
    pdf.setFillColor(255, 255, 255);

    // Generar estrellas con posiciones pseudo-aleatorias reproducibles
    const starCount = 50;
    const seed = 12345;

    for (let i = 0; i < starCount; i++) {
      const x = ((seed + i * 7919) % 1000) / 1000 * width;
      const y = ((seed + i * 7901) % 1000) / 1000 * height;
      const size = ((seed + i * 7907) % 100) / 100 * 1.5 + 0.5;

      pdf.circle(x, y, size, 'F');
    }

    // Algunas estrellas más grandes
    for (let i = 0; i < 10; i++) {
      const x = ((seed + i * 1009) % 1000) / 1000 * width;
      const y = ((seed + i * 1013) % 1000) / 1000 * height;
      const size = 1.5 + ((seed + i * 1019) % 100) / 100;

      pdf.circle(x, y, size, 'F');
    }
  }

  /**
   * Dibuja formas geométricas decorativas
   */
  private static drawGeometric(pdf: jsPDF, width: number, height: number): void {
    pdf.setFillColor(255, 255, 255);
    
    // Círculos grandes en las esquinas con transparencia
    const originalAlpha = 1.0;
    
    // Nota: jsPDF no soporta transparencia directamente de forma simple
    // Usamos círculos más pequeños para simular transparencia
    const opacity = 0.1;
    
    // Círculos decorativos
    pdf.setFillColor(255, 255, 255);
    pdf.circle(0, 0, 30, 'F');
    pdf.circle(width, 0, 30, 'F');
    pdf.circle(0, height, 30, 'F');
    pdf.circle(width, height, 30, 'F');

    // Líneas decorativas
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(2);
    pdf.line(width / 4, height / 3, width * 3 / 4, height / 3);
    pdf.line(width / 4, height * 2 / 3, width * 3 / 4, height * 2 / 3);
  }

  /**
   * Dibuja decoración simple con líneas en las esquinas
   */
  private static drawSimple(pdf: jsPDF, width: number, height: number): void {
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(1);

    const margin = 10;
    const lineLength = 20;

    // Esquina superior izquierda
    pdf.line(margin, margin, margin + lineLength, margin);
    pdf.line(margin, margin, margin, margin + lineLength);

    // Esquina superior derecha
    pdf.line(width - margin, margin, width - margin - lineLength, margin);
    pdf.line(width - margin, margin, width - margin, margin + lineLength);

    // Esquina inferior izquierda
    pdf.line(margin, height - margin, margin + lineLength, height - margin);
    pdf.line(margin, height - margin, margin, height - margin - lineLength);

    // Esquina inferior derecha
    pdf.line(width - margin, height - margin, width - margin - lineLength, height - margin);
    pdf.line(width - margin, height - margin, width - margin, height - margin - lineLength);

    // Marco decorativo central
    const frameMargin = 30;
    pdf.setLineWidth(0.5);
    pdf.rect(
      frameMargin,
      frameMargin,
      width - frameMargin * 2,
      height - frameMargin * 2
    );
  }
}