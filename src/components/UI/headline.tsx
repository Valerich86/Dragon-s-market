import { font_heading } from "@/lib/fonts";
import Image from "next/image";

interface Props {
  text: string;
  emojiIndex?: number;
}

export default function Headline({ text, emojiIndex }: Props) {
  const isValidIndex =
    emojiIndex !== undefined && emojiIndex >= 0 && emojiIndex < text.length;

  let parts;

  if (isValidIndex) {
    parts = [
      text.slice(0, emojiIndex - 1),
      <Image
        src={"/images/emoji.webp"}
        alt="Смайлик"
        width={50}
        height={50}
        className="inline-block align-middle -mx-2 animate-emodji"
      />,
      text.slice(emojiIndex),
    ];
  } else {
    parts = [text];
  }

  return (
    <h1
      className={`${font_heading.className} text-3xl text-center lg:text-5xl lg:mb-10`}
    >
      {parts.map((part, index) => (
        <span key={index}>{part}</span>
      ))}
    </h1>
  );
}
