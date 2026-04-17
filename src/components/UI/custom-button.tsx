"use client";

import { PiSpinnerGapThin } from "react-icons/pi";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  options?: string;
  text: string;
  buttonType?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  onClick,
  options,
  text,
  buttonType = "button",
  isLoading = false,
  disabled = false,
}: Props) {
  return (
    <button
      type={buttonType}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={
        `${options} ${!isLoading && !disabled 
          ? "active:scale-98 hover:shadow-[0px_0px_20px_-5px_#E23324] bg-accent" : "bg-gray-600"} 
          p-1 rounded-full text-secondary transition duration-400 cursor-pointer outline-none text-center`
        }
    >
      {!isLoading ? (
        text
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <PiSpinnerGapThin className="text-center animate-spin" size={35} />
        </div>
      )}
    </button>
  );
}
