const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiBaseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev/api` : ''

export const apiConfiguration = {
  isConfigured: Boolean(apiBaseUrl),
  baseUrl: apiBaseUrl,
}

export function collectionFrom(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.docs)) return payload.docs
  return []
}

export async function getCollection(resource, endpoint = `${apiBaseUrl}/${resource}/`) {
  if (!apiBaseUrl) throw new Error('VITE_CODESPACE_NAME is not configured.')
  const response = await fetch(endpoint)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)
  return collectionFrom(await response.json())
}