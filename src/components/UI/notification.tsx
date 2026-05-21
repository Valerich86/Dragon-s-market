"use client";

import { AnimatePresence, easeOut, motion } from "framer-motion";
import Smiler from "./smiler";

interface Props {
  text: string;
  show: boolean;
  withAcception?: boolean;
  iconType?: "emodji" | "mascot";
  mood?: "nice" | "evil";
  onAccept?: () => void;
  onAbort?: () => void;
}

const buttonStyle =
  "w-25 py-1 rounded-md hover:opacity-90 active:scale-95 cursor-pointer";

export default function Notification({
  text,
  show,
  withAcception = false,
  iconType = "mascot",
  mood = "nice",
  onAccept,
  onAbort,
}: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`w-screen h-screen flex flex-col justify-center 
          items-center fixed inset-0 text-2xl text-primary z-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <div
            className={`w-[90vw] p-5 gap-5 md:w-3/5 lg:w-1/3 flex flex-col rounded-xl
            items-center justify-center bg-primary text-secondary text-sm
            shadow-[0px_0px_30px_25px_rgba(59,130,246,0.12)]`}
          >
            <div className="flex w-full items-center justify-around">
              <p>{text}</p>
              <Smiler iconType={iconType} mood={mood} />
            </div>
            {withAcception && (
              <div className={`w-full flex justify-evenly`}>
                <button
                  className={`bg-zinc-600 ${buttonStyle}`}
                  onClick={onAbort}
                >
                  Отмена
                </button>
                <button
                  className={`bg-accent text-secondary ${buttonStyle}`}
                  onClick={onAccept}
                >
                  Да
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
