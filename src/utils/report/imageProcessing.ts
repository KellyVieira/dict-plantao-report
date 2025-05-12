
/**
 * Image processing utilities for document export
 */

// Helper function to convert base64 data URL to blob
export const base64ToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return await response.blob();
};

// Helper function to convert base64 to Uint8Array (browser-compatible)
export const base64ToUint8Array = (base64String: string): Uint8Array => {
  // Remove data URL prefix if present
  const base64 = base64String.split(',')[1] || base64String;
  // Convert base64 to binary string using the browser's atob function
  const binaryString = atob(base64);
  // Create Uint8Array from binary string
  return Uint8Array.from(binaryString, c => c.charCodeAt(0));
};

/**
 * Process images for DOCX export
 */
export const processImageForDocx = async (
  dataUrl: string,
  description: string,
  index: number
): Promise<{
  imageData: ArrayBuffer;
  altText: {
    name: string;
    description: string;
  };
}> => {
  try {
    // Convert image to blob
    const blob = await base64ToBlob(dataUrl);
    
    // Convert blob to arrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    
    return {
      imageData: arrayBuffer,
      altText: {
        name: `image-${index + 1}`,
        description: description || `Image ${index + 1}`,
      }
    };
  } catch (error) {
    throw new Error(`Failed to process image: ${error}`);
  }
};
