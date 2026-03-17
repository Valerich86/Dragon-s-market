import { PiSpinnerBall } from "react-icons/pi";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center opacity-80 absolute inset-0">
        {/* <PiSpinnerBall size={80} className="animate-spin mb-20"/> */}
        <div className="w-30 h-30 animate-spin">
          <Image
            src={"/images/stickers/heart.webp"}
            alt="загрузка..."
            width={200}
            height={200}
            loading="eager"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <div className="h-screen"></div>
    </>
  );
}
