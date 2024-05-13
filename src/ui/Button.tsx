export function Button(props: JSX.IntrinsicElements["button"]) {
  const { className, children, ...buttonProps } = props
  return (
    <button
      className={
        "px-4 py-2 border border-transparent rounded-md shadow-sm " +
        "font-medium text-white text-center " +
        "bg-accent-600 hover:bg-accent-700 disabled:bg-gray-600 " +
        "outline outline-offset-2 outline-0 focus:outline-2 outline-accent-600 " +
        "transition-colors " +
        (className ?? "")
      }
      {...buttonProps}
    >
      {children}
    </button>
  )
}
