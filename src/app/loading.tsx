import { PiSpinnerBall } from "react-icons/pi";
export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center opacity-80">
      <PiSpinnerBall size={80} className="animate-spin mb-20" />
    </div>
  );
}
