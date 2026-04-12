import Image from "next/image";

export default function Smiler() {
  return (
    <Image
      src={"/images/emoji.webp"}
      alt="Смайлик"
      width={50}
      height={50}
      className={
        `inline-block align-middle -mx-2 animate-emodji hover:cursor-pointer 
        hover:scale-110 hover:rotate-10 active:rotate-10 active:scale-110 
        transition-transform duration-300`
      }
    />
  );
}
