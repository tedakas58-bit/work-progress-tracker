# Adding Geez Font Support for PDF Export

## Current Status
The PDF export system is now prepared to support Amharic/Geez fonts, but currently falls back to English due to font loading not being implemented yet.

## How to Add Full Amharic Support

### Step 1: Download a Geez Font
From the repository: https://github.com/geezorg/legally-free-geez-fonts

Recommended fonts:
- **Abyssinica SIL** - Good for general use
- **Noto Sans Ethiopic** - Modern, clean look
- **Kefa** - Traditional style

### Step 2: Convert Font to Base64
1. Download the TTF file (e.g., `AbyssinicaSIL-Regular.ttf`)
2. Convert to base64 using online tools or Node.js:
```javascript
const fs = require('fs');
const fontBuffer = fs.readFileSync('AbyssinicaSIL-Regular.ttf');
const fontBase64 = fontBuffer.toString('base64');
fs.writeFileSync('font-base64.txt', fontBase64);
```

### Step 3: Update geezFont.js
Replace the placeholder in `frontend/src/utils/geezFont.js`:

```javascript
export const loadGeezFont = async (doc, fontName = 'AbyssinicaSIL') => {
  try {
    // Add your base64 font data here
    const fontBase64 = 'YOUR_FONT_BASE64_DATA_HERE';
    
    doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
    doc.addFont(`${fontName}.ttf`, fontName, 'normal');
    doc.setFont(fontName);
    
    return true;
  } catch (error) {
    console.error('Failed to load Geez font:', error);
    return false;
  }
};

export const canRenderAmharic = () => {
  return true; // Change this to true once font is loaded
};
```

### Step 4: Test
1. Set your language to Amharic in the dashboard
2. Export a PDF report
3. Verify Amharic text displays correctly

## Alternative: Use Web Fonts
Instead of embedding fonts, you could:
1. Load Geez fonts via CSS in your app
2. Use html2canvas to capture the dashboard
3. Insert the canvas image into the PDF

## Current Behavior
- **Language = English**: Full English PDF
- **Language = Amharic**: English PDF with note about font availability
- **Excel/Word**: Full bilingual support (they handle fonts better)

## Benefits of Adding Geez Font
- ✅ Native Amharic text in PDF exports
- ✅ Professional appearance for Ethiopian users
- ✅ Consistent with dashboard language settings
- ✅ Better accessibility and user experience

## File Size Consideration
Embedding fonts increases PDF file size by ~200-500KB. This is acceptable for most use cases.

## Status: READY FOR IMPLEMENTATION
The code structure is in place. Just need to add the actual font file and update the font loading function.