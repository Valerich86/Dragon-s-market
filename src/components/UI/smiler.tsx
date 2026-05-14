import Image from "next/image";

interface Props {
  iconType?: "emodji" | "mascot";
  mood?: "nice" | "evil" | "inBox";
}

export default function Smiler({ iconType, mood }: Props) {
  return (
    <Image
      src={
        iconType === "mascot" && mood === "nice"
          ? "/images/stickers/candy.webp"
          : iconType === "mascot" && mood === "evil"
            ? "/images/stickers/evil.webp"
            : iconType === "mascot" && mood === "inBox"
            ? "/images/stickers/in_box.webp"
            : "/images/emoji.webp"
      }
      alt={iconType === "emodji" ? "смайлик" : "дракон"}
      width={50}
      height={50}
      className={`inline-block align-middle -mx-2 animate-emodji hover:cursor-pointer 
        hover:scale-110 hover:rotate-10 active:rotate-10 active:scale-110 
        transition-transform duration-300`}
    />
  );
}
