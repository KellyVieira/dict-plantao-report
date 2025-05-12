
/**
 * Utilities for loading document emblems
 */

// Placeholder for images that will be loaded
let brasaoEstadoGoias: Uint8Array;
let brasaoPolicialCivil: Uint8Array;

/**
 * Load the emblems needed for the document
 */
export const loadEmblems = async (): Promise<void> => {
  try {
    // Use the uploaded images
    const stateResponse = await fetch('/lovable-uploads/81c65d63-622f-4659-9e6e-325660565994.png');
    const policeResponse = await fetch('/lovable-uploads/40f0ded4-d89b-4ec7-847e-a35119ee6181.png');
    
    // Convert to Uint8Array instead of Buffer for browser compatibility
    brasaoEstadoGoias = new Uint8Array(await stateResponse.arrayBuffer());
    brasaoPolicialCivil = new Uint8Array(await policeResponse.arrayBuffer());
    
    console.log("Emblems loaded successfully");
  } catch (error) {
    console.error("Error loading emblems:", error);
    // Create empty arrays in case of failure
    brasaoEstadoGoias = new Uint8Array();
    brasaoPolicialCivil = new Uint8Array();
  }
};

/**
 * Get loaded emblems
 */
export const getEmblems = (): { 
  brasaoEstadoGoias: Uint8Array; 
  brasaoPolicialCivil: Uint8Array 
} => {
  return {
    brasaoEstadoGoias,
    brasaoPolicialCivil
  };
};
