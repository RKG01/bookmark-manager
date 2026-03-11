// Get favicon URL for a given website URL
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Use Google's favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    return null;
  }
}

module.exports = { getFaviconUrl };
