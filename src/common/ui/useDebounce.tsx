import * as React from "react"

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  const [isStale, setIsStale] = React.useState(false)
  const lastTimeout = React.useRef<number>()

  React.useEffect(() => {
    setIsStale(true)
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
      setIsStale(false)
    }, delay)
    lastTimeout.current = timeout
    return () => {
      clearTimeout(timeout)
    }
  }, [value])

  return [
    debouncedValue,
    (value: T) => {
      clearTimeout(lastTimeout.current)
      setDebouncedValue(value)
      setIsStale(false)
    },
    isStale,
  ] as const
}
