/**
 * Resolves a local asset path (e.g. "/profile1.jpg") against the Vite base URL
 * so it works correctly on subdirectory deployments like GitHub Pages.
 *
 * External URLs (http/https) are returned as-is.
 *
 * @param {string} path
 * @returns {string}
 */
export function resolveAsset(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.BASE_URL || '/'
  // Avoid double slashes: base already ends with '/'
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}
