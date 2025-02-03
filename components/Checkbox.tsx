// components/Checkbox.tsx
import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect, InputHTMLAttributes } from "react";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
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

      {label && <Text color="white">{label}</Text>}
    </Flex>
  );
};

export default Checkbox;
