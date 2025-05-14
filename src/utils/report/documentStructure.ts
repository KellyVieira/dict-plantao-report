
/**
 * This file re-exports all document structure related functions
 * which have been split into smaller files for better organization.
 */

// Re-export from emblems.ts
export { loadEmblems, getEmblems } from './emblems';

// Re-export from sectionCreators.ts
export {
  createHeaderSection,
  createIntroductionSection,
  createGeneralDataSection,
  createOccurrencesSection,
  createImagesSectionHeader,
  createConclusionSection,
  createSignaturesSection
} from './sectionCreators';

// Re-export from imageProcessors.ts
export { processImagesForDocument } from './imageProcessors';

// Re-export from documentSections.ts
export { getDocumentSection } from './documentSections';
