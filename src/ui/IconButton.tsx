export function IconButton(props: JSX.IntrinsicElements["button"]) {
  const { className, children, ...buttonProps } = props

  return (
    <button
      className={
        "flex justify-center items-center aspect-square " +
        "border border-transparent text-xl font-medium rounded-full " +
        "text-primary text-center hover:bg-gray-500/25 transition-colors " +
        "focus:outline outline-2 outline-offset-2 outline-accent-600 " +
        (className ?? "")
      }
      {...buttonProps}
    >
      {children}
    </button>
  )
}
