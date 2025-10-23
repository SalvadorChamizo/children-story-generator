// src/pdf-service/index.ts

/**
 * Servicio completo de generación de PDFs para relatos infantiles
 * 
 * @module PDFService
 * @author Tu Nombre
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * import { PDFService } from './pdf-service';
 * 
 * const story = {
 *   title: 'Mi Relato',
 *   content: '...',
 *   // ... más campos
 * };
 * 
 * // Generar y descargar
 * await PDFService.generateAndDownload(story);
 * 
 * // Obtener blob
 * const result = await PDFService.generateBlob(story);
 * ```
 */

// Exportar el generador principal
export { PDFGenerator as PDFService } from './pdf-generator';

// Exportar tipos
export type {
  Story,
  StoryMetadata,
  ValidationResult,
  ValidationDetails,
  PDFOptions,
  Margins,
  CoverOptions,
  PDFGenerationResult,
} from './types';

// Exportar utilidades (opcional, para uso avanzado)
export {
  formatDate,
  wrapText,
  generateSafeFilename,
  hexToRgb,
} from './utils';

// Exportar generador de portadas (opcional, para uso avanzado)
export { CoverGenerator } from './cover-generator';