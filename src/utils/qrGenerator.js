import QRCode from 'qrcode';

/**
 * Generate a QR Code as a data URL (PNG format)
 * @param {string} text - The text/URL to encode
 * @param {Object} options - QR Code generation options
 * @returns {Promise<string>} - Data URL of the generated QR Code
 */
export const generateQRCode = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 1,
      width: 250,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    const dataUrl = await QRCode.toDataURL(text, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate a QR Code as SVG string
 * @param {string} text - The text/URL to encode
 * @param {Object} options - QR Code generation options
 * @returns {Promise<string>} - SVG string of the generated QR Code
 */
export const generateQRCodeSVG = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'svg',
      width: 250,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    const svgString = await QRCode.toString(text, {
      ...qrOptions,
      type: 'svg'
    });
    
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};

/**
 * Download QR Code as a file
 * @param {string} dataUrl - The data URL of the QR Code
 * @param {string} format - The format to download ('png' or 'svg')
 * @param {string} fileName - The name of the file
 */
export const downloadQRCode = (dataUrl, format = 'png', fileName = 'qrcode') => {
  const link = document.createElement('a');
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '_');
  
  link.download = `${sanitizedFileName}_${timestamp}.${format}`;
  link.href = dataUrl;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate if a string is a valid URL
 * @param {string} string - The string to validate
 * @returns {boolean} - Whether the string is a valid URL
 */
export const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    // Try with https:// prefix
    try {
      new URL(`https://${string}`);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Validate Google Place ID format
 * @param {string} placeId - The Place ID to validate
 * @returns {boolean} - Whether the Place ID has valid format
 */
export const isValidPlaceId = (placeId) => {
  // Google Place IDs are typically 27+ characters and contain letters, numbers, underscores, and hyphens
  const placeIdPattern = /^[A-Za-z0-9_-]{20,}$/;
  return placeIdPattern.test(placeId);
};

/**
 * Format a URL with protocol if missing
 * @param {string} url - The URL to format
 * @returns {string} - The formatted URL with protocol
 */
export const formatURL = (url) => {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return '';
  }
  
  // Check if URL already has a protocol
  if (!/^https?:\/\//i.test(trimmedUrl)) {
    return `https://${trimmedUrl}`;
  }
  
  return trimmedUrl;
};

/**
 * Generate Google Review URL from Place ID
 * @param {string} placeId - The Google Place ID
 * @returns {string} - The Google Review URL
 */
export const generateGoogleReviewURL = (placeId) => {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
};

/**
 * Get contrast color (black or white) based on background color
 * @param {string} hexColor - The hex color to check
 * @returns {string} - Either '#000000' or '#FFFFFF'
 */
export const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export default {
  generateQRCode,
  generateQRCodeSVG,
  downloadQRCode,
  isValidURL,
  isValidPlaceId,
  formatURL,
  generateGoogleReviewURL,
  getContrastColor
};
