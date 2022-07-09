import { useEffect, useMemo, useRef, useState } from "react"

export function useLoader<T>(
  effect: () => Promise<T | undefined>,
  inputs: readonly unknown[]
): State<T> {
  const [value, setValue] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const key = useRef(0)

  useEffect(() => {
    setValue(undefined)
    setError(undefined)
    let currentKey = (key.current += 1)
    setIsLoading(true)

    effect()
      .then((value) => {
        if (currentKey === key.current) setValue(value)
      })
      .catch((error) => {
        if (currentKey === key.current) setError(error)
      })
      .finally(() => {
        if (currentKey === key.current) setIsLoading(false)
      })

    return () => {
      currentKey = -1
    }
  }, inputs)

  return useMemo(() => ({ value, error, isLoading }), [value, error, isLoading])
}

interface State<T> {
  value?: T
  error?: Error
  isLoading: boolean
}
