import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
}

type SelectProps<Options extends Option[], T extends FieldValues> = {
  label: string;
  options: Options;
  field: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export function FormSelect<Options extends Option[], T extends FieldValues>(props: SelectProps<Options, T>): any {
  const { label, options, field, register, error } = props;
  return (
    <div className="mb-6">
      <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <select
        id=""
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        {...register(field)}
      >
        <option label="" />
        {options.map(option =>
          <option key={option.value} value={option.value}>{option.label}</option>
        )}
      </select>
      {error && <span className="text-xs text-red-500">This field is required</span>}
    </div>
  )
}