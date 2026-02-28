import Image from "next/image";
import HeroSection from "@/components/sections/hero";

export default function Home() {
  return (
    <div className={
      `w-full overflow-x-hidden bg-primary text-secondary x-spacing
      theme-1:bg-primary theme-2:bg-[url(/images/bg1.png)]  theme-4:bg-maskot3  theme-5:bg-maskot5
      theme-1:text-secondary  theme-2:text-secondary theme-3:text-primary theme-4:text-primary theme-5:text-secondary`
    }>
      <HeroSection />
    </div>
  );
}
