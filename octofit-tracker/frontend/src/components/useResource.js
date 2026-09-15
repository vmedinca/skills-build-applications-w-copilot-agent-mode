import { useEffect, useState } from 'react'
import { getCollection } from '../api.js'

export function useResource(resource) {
  const [state, setState] = useState({ data: [], loading: true, error: '' })

  useEffect(() => {
    let active = true
    getCollection(resource)
      .then((data) => active && setState({ data, loading: false, error: '' }))
      .catch((error) => active && setState({ data: [], loading: false, error: error.message }))
    return () => {
      active = false
    }
  }, [resource])

  return state
}