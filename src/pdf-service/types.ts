// Objeto principal que contiene toda la información del relato que vamos a convertir en pdf

export interface Story {
	
	title: string;
	content: string;
	topic: string;
	metadata: StoryMetadata;
}

// Guarda estadísticas o inforamción sobre el genero o relato
export interface StoryMetadata {
	
	wordCount: number;
	characterCount: number;
	generatedAt: Date;
	validationResult: ValidationResult;
	attempts?: number; 
}

// Dice si el relato cumple con los requisitos (500 palabras, 3 personajes, etc.)
export interface ValidationResult {
	
	isValid: boolean;
	wordCount: number;
	characterCount: number;
	hasStructure: boolean;
	details: ValidationDetails;
}

// ValidationDetails desglosa que pasó y que no pasó
export interface ValidationDetails {

	lengthValid: boolean;
	structureValid: boolean;
	charactersValid: boolean;
}

// PDFOptions son las configuraciones que el usuario puede personalizar al generar el PDF.

export interface PDFOptions {

	includeCover?: boolean;
	includeMetadata?: boolean;
	fontSize?: number;
	fontFamily?: 'Times' | 'Helvetica' | 'Courier';
	pageFormat?: 'a4' | 'letter';
	margins?: Margins;
	coverOptions?: CoverOptions;
}

// Margins define los espacios en blanco alrededor del contenido (en milímetros)
export interface Margins {
	
	top: number;
	right: number;
	bottom: number;
	left: number;
}


// CoverOptions personaliza cómo se ve la portada

export interface CoverOptions {

	backgroundColor?: string;
	textColor?: string;
	includeIllustration?: boolean;
	illustrationStyle?: 'stars' | 'geometric' | 'simple';
}


// PDFGenerationResult es lo que devuelven las funciones después de intentar generar el PDF.

export interface PDFGenerationResult {

	success: boolean;
	filename: string;
	blob?: Blob;
	error?: string;
}