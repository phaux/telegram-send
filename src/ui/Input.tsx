import { ReactNode } from "react"

export function Input(
  props: JSX.IntrinsicElements["input"] & {
    label?: ReactNode | null
    inputClassName?: string
    hint?: ReactNode | null
    error?: ReactNode | null
  }
) {
  const {
    className,
    type = "text",
    label,
    inputClassName,
    id,
    name,
    hint,
    error,
    ...inputProps
  } = props

  return (
    <div id={id} className={"flex flex-col gap-2 " + (className ?? "")}>
      {label != null ? (
        <label htmlFor={name} className="text-sm">
          {label}
        </label>
      ) : null}

      <input
        name={name}
        id={name}
        type={type}
        className={
          "p-2 bg-transparent shadow-sm focus:ring-0 transition-colors " +
          "border border-gray-500 focus:border-accent-600 rounded-md " +
          "outline outline-0 outline-gray-500 focus:outline-offset-0 focus:outline-1 focus:outline-accent-600 " +
          (inputClassName ?? "")
        }
        aria-describedby={name != null ? `${name}-hint` : undefined}
        aria-invalid={error != null}
        aria-errormessage={name != null ? `${name}-error` : undefined}
        {...inputProps}
      />

      {hint != null && error == null ? (
        <p id={name != null ? `${name}-hint` : undefined} className="text-sm text-gray-500">
          {hint}
        </p>
      ) : null}

      {error != null ? (
        <p id={name != null ? `${name}-error` : undefined} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  )
}
