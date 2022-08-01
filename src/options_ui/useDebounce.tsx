import { useEffect, useRef, useState } from "react"

export function useDebounce<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)
    timeoutRef.current = timeout
    return () => {
      clearTimeout(timeout)
    }
  }, [value, delayMs])

  function resetDebouncedValue(value: T) {
    clearTimeout(timeoutRef.current)
    setDebouncedValue(value)
  }

  return [debouncedValue, resetDebouncedValue] as const
}
