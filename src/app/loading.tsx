import { PiSpinnerBall } from "react-icons/pi";
import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center pb-[20vh] opacity-80">
        {/* <PiSpinnerBall size={80} className="animate-spin mb-20"/> */}
        <div className="w-30 h-30 animate-spin">
          <Image
            src={"/images/stickers/party.webp"}
            alt="загрузка..."
            width={200}
            height={200}
            loading="eager"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </>
  );
}
