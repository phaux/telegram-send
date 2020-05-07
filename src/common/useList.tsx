import * as React from "react"

export function useList<T>(initialItems: T[] = []) {
  const [items, dispatch] = React.useReducer((items: T[], action: ListAction<T>) => {
    switch (action.type) {
      case "add": {
        return [...items, action.item]
      }
      case "remove": {
        return items.filter((item) => item !== action.item)
      }
      default: {
        return items
      }
    }
  }, initialItems)

  return [items, dispatch] as const
}

export type ListAction<T> =
  | {
      type: "add"
      item: T
    }
  | {
      type: "remove"
      item: T
    }
