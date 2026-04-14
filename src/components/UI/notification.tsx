import { font_bold, font_light } from "@/lib/fonts";
import Smiler from "./smiler";

interface Props {
  text: string;
  onAccept?: () => void;
  onAbort?: () => void;
  ageConfirmNeeded: boolean;
}

const buttonStyle = "w-20 py-1 rounded-md hover:opacity-90 active:scale-95 cursor-pointer";

export default function Notification({ text, onAccept, onAbort, ageConfirmNeeded }: Props) {
  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center 
      items-center fixed inset-0 text-2xl text-primary z-50
      ${!ageConfirmNeeded ? "animate-message" : ""}`}
    >
      <div className={
        `w-[90vw] p-5 gap-5 md:w-3/5 lg:w-1/3 flex flex-col rounded-xl
        items-center justify-center bg-primary text-secondary 
        shadow-[0px_0px_30px_25px_rgba(59,130,246,0.12)]`
      }>
        <div className="flex w-full items-center">
          <p>{text}</p>
          <Smiler />
        </div>
        {ageConfirmNeeded && (
          <div className={`w-full flex justify-evenly`}>
            <button
              className={`bg-accent ${buttonStyle}`}
              onClick={onAbort}
            >
              нет
            </button>
            <button
              className={`bg-green-700 text-secondary ${buttonStyle}`}
              onClick={onAccept}
            >
              да
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
