import { useState } from "react"
import { SWRResponse } from "swr"

export function useMutation<T>(response: SWRResponse<T>) {
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<Error>()

  const mutate = (...[data, opts]: Parameters<typeof response.mutate>) => {
    setIsMutating(true)
    setError(undefined)
    response
      .mutate(data, opts)
      .catch((err) => setError(err as Error))
      .finally(() => setIsMutating(false))
  }

  function clearError() {
    setError(undefined)
  }

  return { isMutating, error, mutate, clearError }
}
