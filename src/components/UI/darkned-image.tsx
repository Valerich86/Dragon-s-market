import Image from "next/image";

interface Props {
  src: string;
  options?: string;
}

export default function DarknedImage({ src, options = "" }: Props) {
  function setSrc(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className={
        `${options} absolute inset-0 after:absolute 
        after:inset-0 after:bg-linear-to-b 
        after:from-transparent after:to-primary after:to-70%`
      }
    >
      <Image
        src={src}
        alt="изображение - фон для страницы"
        width={1980}
        height={1024}
        loading="eager"
        quality={85}
        className="h-full w-full object-right object-cover select-none pointer-events-none"
      />
    </div>
  );
}
