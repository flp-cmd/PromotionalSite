// components/Checkbox.tsx
import { Box, Flex } from "@chakra-ui/react";
import { useState, useEffect, InputHTMLAttributes } from "react";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  checkboxClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  checkboxClassName = "",
  ...props
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onChange?.(newChecked);
    }
  };

  return (
    <Flex flexDirection={"row"} gap={"5px"} mt={"10px"}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
        {...props}
      />

      {/* Checkbox visual */}
      <Box bgColor={"#fff"}>
        {isChecked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </Box>

      {label && (
        <span
          className={`select-none ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {label}
        </span>
      )}
    </Flex>
  );
};

export default Checkbox;
