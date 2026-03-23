import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";

const inputBase =
  "block w-full rounded-md border border-slate-300 bg-white shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 disabled:bg-slate-50 disabled:text-slate-500";

const inputSizes = {
  sm: "text-xs min-h-9 px-3",
  md: "text-sm min-h-10 px-4",
};

export function FormSection({ title, description, children, className }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 sm:p-6",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormAlert({ tone = "error", children, className }) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
    success: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div
      className={cn(
        "rounded-md border p-3 text-sm",
        tones[tone] ?? tones.error,
        className,
      )}
      role={tone === "error" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}

function BaseTextField({
  label,
  required,
  hint,
  error,
  size = "md",
  className,
  inputClassName,
  id,
  name,
  ...props
}) {
  const fieldId = id ?? name;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <input
        id={fieldId}
        name={name}
        required={required}
        aria-invalid={!!error}
        {...props}
        className={cn(
          inputBase,
          inputSizes[size] ?? inputSizes.md,
          inputClassName,
        )}
      />

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function BaseTextAreaField({
  label,
  required,
  hint,
  error,
  className,
  textareaClassName,
  id,
  name,
  rows = 3,
  ...props
}) {
  const fieldId = id ?? name;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <textarea
        id={fieldId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        {...props}
        className={cn(
          inputBase,
          "text-sm px-4 py-2 min-h-24 resize-y",
          textareaClassName,
        )}
      />

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function BaseCheckboxField({ label, hint, className, id, name, ...props }) {
  const fieldId = id ?? name;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          {...props}
        />
        {label ? (
          <label htmlFor={fieldId} className="text-sm text-slate-700">
            {label}
          </label>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function getPathValue(obj, path) {
  if (!obj || !path) return undefined;

  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let current = obj;
  for (const part of parts) {
    current = current?.[part];
    if (current === undefined) return undefined;
  }
  return current;
}

function getErrorMessage(errors, name) {
  const node = getPathValue(errors, name);
  if (!node) return "";
  if (typeof node.message === "string") return node.message;
  return "";
}

export function TextField({ name, registerOptions, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <BaseTextField
      name={name}
      error={getErrorMessage(errors, name)}
      {...register(name, registerOptions)}
      {...props}
    />
  );
}

export function TextAreaField({ name, registerOptions, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <BaseTextAreaField
      name={name}
      error={getErrorMessage(errors, name)}
      {...register(name, registerOptions)}
      {...props}
    />
  );
}

export function CheckboxField({ name, registerOptions, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <BaseCheckboxField
      name={name}
      hint={props.hint}
      {...register(name, registerOptions)}
      {...props}
      aria-invalid={!!getPathValue(errors, name)}
    />
  );
}

export function FileField({
  label,
  required,
  hint,
  error,
  className,
  inputClassName,
  id,
  name,
  ...props
}) {
  const fieldId = id ?? name;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required ? <span className="text-red-500">*</span> : null}
        </label>
      ) : null}

      <input
        id={fieldId}
        name={name}
        required={required}
        type="file"
        aria-invalid={!!error}
        {...props}
        className={cn(inputBase, inputSizes.md, inputClassName)}
      />

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
