import "../styles/Auth.css";

type FormInputProps = {
  type?: "text" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function FormInput({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
}: FormInputProps) {
  return (
    <input
      className="form-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
