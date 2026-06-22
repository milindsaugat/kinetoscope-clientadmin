/* ============================================================
   Config: apiUrl.js
   Description: Dynamic API URL helper for Dev (relative proxy)
                and Production (absolute Vercel URL)
   ============================================================ */

export const getApiUrl = (path) => {
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.');
  
  const baseUrl = isLocal ? '' : 'https://kinetoscope-backend.vercel.app';
  return `${baseUrl}${path}`;
};

/* ============ END: apiUrl.js ============ */
