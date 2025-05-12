
/**
 * Utilities for loading document emblems
 */

// Placeholder for images that will be loaded
let brasaoEstadoGoias: Buffer;
let brasaoPolicialCivil: Buffer;

/**
 * Load the emblems needed for the document
 */
export const loadEmblems = async (): Promise<void> => {
  try {
    const stateResponse = await fetch('/brasao-goias.png');
    const policeResponse = await fetch('/brasao-policia-civil.png');
    
    brasaoEstadoGoias = Buffer.from(await stateResponse.arrayBuffer());
    brasaoPolicialCivil = Buffer.from(await policeResponse.arrayBuffer());
  } catch (error) {
    console.error("Error loading emblems:", error);
    // Create empty buffers in case of failure
    brasaoEstadoGoias = Buffer.from([]);
    brasaoPolicialCivil = Buffer.from([]);
  }
};

/**
 * Get loaded emblems
 */
export const getEmblems = (): { 
  brasaoEstadoGoias: Buffer; 
  brasaoPolicialCivil: Buffer 
} => {
  return {
    brasaoEstadoGoias,
    brasaoPolicialCivil
  };
};
