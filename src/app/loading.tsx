import React from "react";
import { PiSpinnerBall } from "react-icons/pi";

interface Props {}

export default function Loading(props: Props) {
  const {} = props;

  return (
    <div
      aria-label="категории"
      className="w-full h-[65vh] flex flex-wrap gap-5 lg:gap-10 items-center justify-center x-spacing opacity-80"
    >
      {/* {Array.from({ length: 10 }, (_, index) => (
        <div key={index}
          className={`sceleton scale-99 w-[45%] z-10 lg:w-1/6 h-50 bg-gray-200 rounded-xl shadow-2xl`}
        ></div>
      ))} */}
      <PiSpinnerBall size={80} className="animate-spin"/>
    </div>
  );
}

