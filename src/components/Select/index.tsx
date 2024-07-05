type Option = {
  value: string | number;
  label: string;
}

type SelectProps = {
  label: string;
  options: Array<Option>;
}

export const Select = ({ label, options }: SelectProps) => {
  return (
    <div>
      <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <select id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        {options.map(option =>
          <option key={option.value} value={option.value}>{option.label}</option>
        )}
      </select>
    </div>
  )
}