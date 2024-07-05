type TextInputProps = {
  field: string;
  type?: "email" | "password" | "text" | "number";
  label: string;
  placeholder?: string;
  required?: boolean;
}

export const TextInput = ({ field, type, label, placeholder, required = false }: TextInputProps) => {
  return (
    <div>
      <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900">
        {label}{required ? " *" : ""}
      </label>
      <input
        type={type}
        id={field}
        placeholder={placeholder}
        // required={required}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  )
}