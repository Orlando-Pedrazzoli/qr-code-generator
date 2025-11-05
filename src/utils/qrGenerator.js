import QRCode from 'qrcode';

/**
 * Generate a QR Code as a data URL (PNG format) with optional logo
 * @param {string} text - The text/URL to encode
 * @param {Object} options - QR Code generation options
 * @returns {Promise<string>} - Data URL of the generated QR Code
 */
export const generateQRCode = async (text, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H', // High error correction for logo overlay
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
    
    // If logo is provided, ensure high error correction
    if (options.logoDataUrl) {
      qrOptions.errorCorrectionLevel = 'H';
    }
    
    const dataUrl = await QRCode.toDataURL(text, qrOptions);
    
    // If logo is provided, overlay it on the QR code
    if (options.logoDataUrl) {
      return await addLogoToQRCode(dataUrl, options.logoDataUrl, qrOptions.width, options.logoSize || 20);
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Add logo to QR Code
 * @param {string} qrDataUrl - The QR Code data URL
 * @param {string} logoDataUrl - The logo data URL
 * @param {number} qrSize - The size of the QR Code
 * @param {number} logoSizePercent - Logo size as percentage of QR code (10-30)
 * @returns {Promise<string>} - Data URL with logo
 */
const addLogoToQRCode = async (qrDataUrl, logoDataUrl, qrSize, logoSizePercent = 20) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = qrSize;
    canvas.height = qrSize;
    
    const qrImage = new Image();
    const logoImage = new Image();
    
    // Load QR Code image
    qrImage.onload = () => {
      // Draw QR Code
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
      
      // Load logo image
      logoImage.onload = () => {
        // Calculate logo size (percentage of QR code size)
        const logoSize = Math.floor(qrSize * (logoSizePercent / 100));
        const logoX = (qrSize - logoSize) / 2;
        const logoY = (qrSize - logoSize) / 2;
        
        // Create white background for logo
        const padding = logoSize * 0.1;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
          logoX - padding, 
          logoY - padding, 
          logoSize + (padding * 2), 
          logoSize + (padding * 2)
        );
        
        // Draw border around logo background
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          logoX - padding, 
          logoY - padding, 
          logoSize + (padding * 2), 
          logoSize + (padding * 2)
        );
        
        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      logoImage.onerror = () => {
        console.error('Error loading logo image');
        resolve(qrDataUrl); // Return QR code without logo on error
      };
      
      logoImage.src = logoDataUrl;
    };
    
    qrImage.onerror = () => {
      reject(new Error('Error loading QR code image'));
    };
    
    qrImage.src = qrDataUrl;
  });
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
    
    // If logo is requested for SVG, use high error correction
    if (options.logoDataUrl) {
      qrOptions.errorCorrectionLevel = 'H';
    }
    
    const svgString = await QRCode.toString(text, {
      ...qrOptions,
      type: 'svg'
    });
    
    // Note: Logo embedding in SVG requires different approach
    // For now, return plain SVG without logo
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
// Linha 171 - substituir função isValidURL
export const isValidURL = (string) => {
  if (!string || typeof string !== 'string') return false;
  
  // Bloquear protocolos perigosos
  const dangerousProtocols = ['javascript:', 'data:', 'file:', 'vbscript:'];
  const lowerString = string.toLowerCase().trim();
  
  if (dangerousProtocols.some(p => lowerString.startsWith(p))) {
    return false;
  }
  
  try {
    const url = new URL(string.startsWith('http') ? string : `https://${string}`);
    // Validar que é http ou https
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
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
 * Generate WiFi QR Code string
 * @param {Object} config - WiFi configuration
 * @returns {string} - WiFi QR Code string
 */
export const generateWiFiString = (config) => {
  const { ssid, password, securityType, hidden } = config;
  
  let wifiString = `WIFI:T:${securityType};S:${ssid};`;
  
  if (securityType !== 'nopass' && password) {
    // Escape special characters in password
    const escapedPassword = password
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/:/g, '\\:');
    wifiString += `P:${escapedPassword};`;
  }
  
  if (hidden) {
    wifiString += 'H:true;';
  }
  
  wifiString += ';';
  
  return wifiString;
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

/**
 * Convert image file to data URL
 * @param {File} file - The image file
 * @returns {Promise<string>} - Data URL of the image
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Resize image to specified dimensions
 * @param {string} dataUrl - The image data URL
 * @param {number} maxSize - Maximum width/height
 * @returns {Promise<string>} - Resized image data URL
 */
export const resizeImage = (dataUrl, maxSize = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions maintaining aspect ratio
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

export default {
  generateQRCode,
  generateQRCodeSVG,
  downloadQRCode,
  isValidURL,
  isValidPlaceId,
  formatURL,
  generateGoogleReviewURL,
  generateWiFiString,
  getContrastColor,
  fileToDataUrl,
  resizeImage
};