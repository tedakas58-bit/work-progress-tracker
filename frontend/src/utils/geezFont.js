// Geez Font Support for jsPDF
// This module handles loading and using Ethiopic/Geez fonts in PDF exports

import { GEEZ_FONT_BASE64, GEEZ_FONT_NAME } from './geezFontData.js';

export const addGeezFontSupport = (doc) => {
  try {
    // Add the Geez font to jsPDF
    doc.addFileToVFS(`${GEEZ_FONT_NAME}.ttf`, GEEZ_FONT_BASE64);
    doc.addFont(`${GEEZ_FONT_NAME}.ttf`, GEEZ_FONT_NAME, 'normal');
    doc.setFont(GEEZ_FONT_NAME);
    
    console.log('✅ Geez font loaded successfully:', GEEZ_FONT_NAME);
    return true;
  } catch (error) {
    console.error('❌ Failed to load Geez font:', error);
    return false;
  }
};

export const canRenderAmharic = () => {
  // We now have Geez font support
  return true;
};

export const getDisplayText = (amharicText, englishText, forceEnglish = false) => {
  if (forceEnglish || !canRenderAmharic()) {
    return englishText;
  }
  return amharicText;
};

// Font loading utility (now implemented!)
export const loadGeezFont = async (doc, fontName = GEEZ_FONT_NAME) => {
  return addGeezFontSupport(doc);
};