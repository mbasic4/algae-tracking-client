type ButtonProps = {
  label: string;
  onClick: () => void;
  size?: "sm" | "md"
}

export const Button = ({ label, onClick, size="md" }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-white font-medium rounded-lg ${size === "md" ? "text-sm" : "text-xs"} px-4 py-2 text-center bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:outline-none focus:ring-emerald-800`}
    >
      {label}
    </button>
  )
} 
