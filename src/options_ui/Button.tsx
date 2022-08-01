export function Button(props: JSX.IntrinsicElements["button"]) {
  const { className, children, ...buttonProps } = props
  return (
    <button
      className={
        "px-4 py-2 border border-transparent " +
        "shadow-sm font-medium rounded-md " +
        "text-white text-center bg-accent-600 hover:bg-accent-700 " +
        "focus:outline outline-2 outline-offset-2 outline-accent-600" +
        (className ?? "")
      }
      {...buttonProps}
    >
      {children}
    </button>
  )
}
