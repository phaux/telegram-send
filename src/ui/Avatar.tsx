export function Avatar(props: JSX.IntrinsicElements["div"]) {
  const { className, children, ...rootProps } = props
  return (
    <div
      className={
        "flex justify-center items-center overflow-hidden aspect-square " +
        "rounded-full bg-gray-500/20 text-gray-500/70 " +
        (className ?? "")
      }
      {...rootProps}
    >
      {children}
    </div>
  )
}
