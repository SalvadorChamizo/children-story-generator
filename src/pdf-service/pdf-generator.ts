// src/pdf-service/pdf-generator.ts

import jsPDF from 'jspdf';
import type {
  Story,
  PDFOptions,
  PDFGenerationResult,
  InternalPDFOptions,
} from './types';
import { CoverGenerator } from './cover-generator';
import {
  formatDate,
  wrapText,
  generateSafeFilename,
  hexToRgb,
} from './utils';

/**
 * Servicio principal para generar PDFs de relatos infantiles
 */
export class PDFGenerator {
  private static readonly DEFAULT_OPTIONS: InternalPDFOptions = {
    includeCover: true,
    includeMetadata: true,
    fontSize: 12,
    fontFamily: 'Times',
    pageFormat: 'a4',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    coverOptions: {
      backgroundColor: '#667eea',
      textColor: '#ffffff',
      includeIllustration: true,
      illustrationStyle: 'stars',
    },
  };

  /**
   * Genera un PDF y lo descarga automáticamente
   */
  static async generateAndDownload(
    story: Story,
    options: PDFOptions = {}
  ): Promise<PDFGenerationResult> {
    try {
      const pdf = await this.generatePDF(story, options);
      const filename = generateSafeFilename(story.title);

      pdf.save(filename);

      return {
        success: true,
        filename,
      };
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Genera un PDF y devuelve el Blob
   */
  static async generateBlob(
    story: Story,
    options: PDFOptions = {}
  ): Promise<PDFGenerationResult> {
    try {
      const pdf = await this.generatePDF(story, options);
      const filename = generateSafeFilename(story.title);
      const blob = pdf.output('blob');

      return {
        success: true,
        filename,
        blob,
      };
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Genera el documento PDF completo
   */
  private static async generatePDF(
    story: Story,
    userOptions: PDFOptions = {}
  ): Promise<jsPDF> {
    const options = this.mergeOptions(userOptions);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: options.pageFormat,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - options.margins.left - options.margins.right;

    // 1. Portada
    if (options.includeCover) {
      this.addCoverPage(pdf, story, options, pageWidth, pageHeight);
      pdf.addPage();
    }

    // 2. Página de título
    this.addTitlePage(pdf, story, options, contentWidth);
    pdf.addPage();

    // 3. Contenido
    this.addContentPages(pdf, story, options, contentWidth, pageHeight);

    // 4. Metadata
    if (options.includeMetadata) {
      pdf.addPage();
      this.addMetadataPage(pdf, story, options, contentWidth);
    }

    return pdf;
  }

  /**
   * Combina opciones del usuario con las predeterminadas
   */
  private static mergeOptions(userOptions: PDFOptions): InternalPDFOptions {
    return {
      ...this.DEFAULT_OPTIONS,
      ...userOptions,
      margins: {
        ...this.DEFAULT_OPTIONS.margins,
        ...userOptions.margins,
      },
      coverOptions: {
        ...this.DEFAULT_OPTIONS.coverOptions,
        ...userOptions.coverOptions,
      },
    };
  }

  /**
   * Añade la página de portada
   */
  private static addCoverPage(
    pdf: jsPDF,
    story: Story,
    options: InternalPDFOptions,
    pageWidth: number,
    pageHeight: number
  ): void {
    // Fondo de color
    const bgColor = hexToRgb(options.coverOptions.backgroundColor);
    pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Ilustración decorativa
    if (options.coverOptions.includeIllustration) {
      CoverGenerator.addIllustration(
        pdf,
        pageWidth,
        pageHeight,
        options.coverOptions.illustrationStyle
      );
    }

    // Título
    const textColor = hexToRgb(options.coverOptions.textColor);
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
    pdf.setFontSize(36);
    pdf.setFont(options.fontFamily, 'bold');

    const titleLines = wrapText(pdf, story.title, pageWidth - 40);
    const titleHeight = titleLines.length * 15;
    const titleY = (pageHeight - titleHeight) / 2;

    titleLines.forEach((line, index) => {
      const textWidth = pdf.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2;
      const y = titleY + index * 15;
      pdf.text(line, x, y);
    });

    // Subtítulo
    pdf.setFontSize(18);
    pdf.setFont(options.fontFamily, 'normal');
    const subtitle = 'Un relato generado con IA';
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, titleY + titleHeight + 20);
  }

  /**
   * Añade la página de título interior
   */
  private static addTitlePage(
    pdf: jsPDF,
    story: Story,
    options: InternalPDFOptions,
    contentWidth: number
  ): void {
    let y = options.margins.top + 30;

    // Título principal
    pdf.setFontSize(28);
    pdf.setFont(options.fontFamily, 'bold');
    pdf.setTextColor('#2C3E50');

    const titleLines = wrapText(pdf, story.title, contentWidth);
    titleLines.forEach((line) => {
      const textWidth = pdf.getTextWidth(line);
      const x = options.margins.left + (contentWidth - textWidth) / 2;
      pdf.text(line, x, y);
      y += 12;
    });

    y += 20;

    // Línea decorativa
    pdf.setDrawColor('#667eea');
    pdf.setLineWidth(0.5);
    pdf.line(
      options.margins.left + 20,
      y,
      options.margins.left + contentWidth - 20,
      y
    );

    y += 20;

    // Información
    pdf.setFontSize(12);
    pdf.setFont(options.fontFamily, 'normal');
    pdf.setTextColor('#7F8C8D');

    const info = [
      `Tema: ${story.topic}`,
      `Fecha: ${formatDate(story.metadata.generatedAt)}`,
      `Palabras: ${story.metadata.wordCount}`,
      `Personajes: ${story.metadata.characterCount}`,
    ];

    info.forEach((line) => {
      const textWidth = pdf.getTextWidth(line);
      const x = options.margins.left + (contentWidth - textWidth) / 2;
      pdf.text(line, x, y);
      y += 8;
    });
  }

  /**
   * Añade las páginas de contenido
   */
  private static addContentPages(
    pdf: jsPDF,
    story: Story,
    options: InternalPDFOptions,
    contentWidth: number,
    pageHeight: number
  ): void {
    pdf.setFontSize(options.fontSize);
    pdf.setFont(options.fontFamily, 'normal');
    pdf.setTextColor('#333333');

    let y = options.margins.top;
    const lineHeight = options.fontSize * 0.5;
    const maxY = pageHeight - options.margins.bottom;

    const paragraphs = story.content.split('\n\n').filter((p) => p.trim());

    paragraphs.forEach((paragraph) => {
      const lines = wrapText(pdf, paragraph.trim(), contentWidth);

      lines.forEach((line) => {
        if (y + lineHeight > maxY) {
          pdf.addPage();
          y = options.margins.top;
        }

        pdf.text(line, options.margins.left, y);
        y += lineHeight;
      });

      y += lineHeight * 1.5;
    });
  }

  /**
   * Añade la página de metadata
   */
  private static addMetadataPage(
    pdf: jsPDF,
    story: Story,
    options: InternalPDFOptions,
    contentWidth: number
  ): void {
    let y = options.margins.top;

    // Título
    pdf.setFontSize(18);
    pdf.setFont(options.fontFamily, 'bold');
    pdf.setTextColor('#2C3E50');
    pdf.text('Información del Relato', options.margins.left, y);

    y += 15;

    // Línea decorativa
    pdf.setDrawColor('#667eea');
    pdf.setLineWidth(0.3);
    pdf.line(options.margins.left, y, options.margins.left + contentWidth, y);

    y += 10;

    // Información detallada
    pdf.setFontSize(11);
    pdf.setFont(options.fontFamily, 'normal');
    pdf.setTextColor('#34495E');

    const metadata = [
      { label: 'Título:', value: story.title },
      { label: 'Tema:', value: story.topic },
      { label: 'Fecha de generación:', value: formatDate(story.metadata.generatedAt) },
      { label: 'Número de palabras:', value: story.metadata.wordCount.toString() },
      { label: 'Personajes identificados:', value: story.metadata.characterCount.toString() },
      {
        label: 'Estado de validación:',
        value: story.metadata.validationResult.isValid ? '✓ Válido' : '⚠ Advertencia',
      },
    ];

    if (story.metadata.attempts) {
      metadata.push({
        label: 'Intentos de generación:',
        value: story.metadata.attempts.toString(),
      });
    }

    metadata.forEach((item) => {
      pdf.setFont(options.fontFamily, 'bold');
      pdf.text(item.label, options.margins.left, y);

      pdf.setFont(options.fontFamily, 'normal');
      const labelWidth = pdf.getTextWidth(item.label);
      pdf.text(item.value, options.margins.left + labelWidth + 3, y);

      y += 8;
    });

    y += 10;

    // Detalles de validación
    pdf.setFontSize(14);
    pdf.setFont(options.fontFamily, 'bold');
    pdf.setTextColor('#2C3E50');
    pdf.text('Detalles de Validación', options.margins.left, y);

    y += 10;

    pdf.setFontSize(10);
    pdf.setFont(options.fontFamily, 'normal');
    pdf.setTextColor('#34495E');

    const validationDetails = [
      {
        label: 'Longitud válida:',
        value: story.metadata.validationResult.details.lengthValid ? '✓' : '✗',
      },
      {
        label: 'Estructura válida:',
        value: story.metadata.validationResult.details.structureValid ? '✓' : '✗',
      },
      {
        label: 'Personajes válidos:',
        value: story.metadata.validationResult.details.charactersValid ? '✓' : '✗',
      },
    ];

    validationDetails.forEach((item) => {
      pdf.text(`${item.label} ${item.value}`, options.margins.left + 5, y);
      y += 6;
    });

    y += 15;

    // Pie de página
    pdf.setFontSize(9);
    pdf.setFont(options.fontFamily, 'italic');
    pdf.setTextColor('#95A5A6');
    const footer = 'Generado automáticamente por el Sistema de Relatos Infantiles con IA';
    const footerWidth = pdf.getTextWidth(footer);
    pdf.text(footer, options.margins.left + (contentWidth - footerWidth) / 2, y);
  }
}