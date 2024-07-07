import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  field: Path<T>;
  type?: "email" | "password" | "text" | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
  const { register, error } = props
  return (
    <div className="mb-6">
      <div>
        <label htmlFor={props.field} className="block mb-2 text-sm font-medium text-gray-900">
          {props.label}{props.required ? " *" : ""}
        </label>
        <input
          type={props.type}
          id={props.field}
          placeholder={props.placeholder}
          {...register(props.field)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  )
}