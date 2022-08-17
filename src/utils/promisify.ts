export function promisify<A extends unknown[], R extends unknown[]>(
  func: (...args: [...A, (...result: R) => unknown]) => unknown
): (...args: A) => Promise<R extends [] ? void : R extends [infer O] ? O : R> {
  return (...args: A) =>
    new Promise((resolve, reject) => {
      func(...args, (...result: R) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          if (result.length === 0) {
            resolve(undefined as never)
          }
          if (result.length === 1) {
            resolve(result[0] as never)
          } else {
            resolve(result as never)
          }
        }
      })
    })
}
