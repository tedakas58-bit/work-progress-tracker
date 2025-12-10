// Geez Font Support for jsPDF
// This module handles loading and using Ethiopic/Geez fonts in PDF exports

// For now, we'll use a simple approach with font fallback
// In production, you would download a font from https://github.com/geezorg/legally-free-geez-fonts
// and convert it to base64 for embedding

export const addGeezFontSupport = (doc) => {
  // Note: This is a placeholder for Geez font support
  // To fully implement:
  // 1. Download a font like "Abyssinica SIL" from the geezorg repository
  // 2. Convert TTF to base64 using online tools or fontmin
  // 3. Add the font to jsPDF using doc.addFileToVFS() and doc.addFont()
  
  // For now, we'll detect if Amharic characters are present and handle gracefully
  return false; // Indicates font not loaded yet
};

export const canRenderAmharic = () => {
  // Check if we have Geez font support
  // For now, return false to use English fallback
  return false;
};

export const getDisplayText = (amharicText, englishText, forceEnglish = false) => {
  if (forceEnglish || !canRenderAmharic()) {
    return englishText;
  }
  return amharicText;
};

// Font loading utility (for future implementation)
export const loadGeezFont = async (doc, fontName = 'AbyssinicaSIL') => {
  try {
    // This would load the font file and add it to jsPDF
    // const fontData = await fetch('/fonts/AbyssinicaSIL-Regular.ttf');
    // const fontBuffer = await fontData.arrayBuffer();
    // const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));
    // 
    // doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
    // doc.addFont(`${fontName}.ttf`, fontName, 'normal');
    // doc.setFont(fontName);
    
    console.log('Geez font loading not implemented yet');
    return false;
  } catch (error) {
    console.error('Failed to load Geez font:', error);
    return false;
  }
};