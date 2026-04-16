interface Props {
  caption?: string;
  options?: string;
}

export default function PaintCaption({
  caption = "Товар дня",
  options = "",
}: Props) {
  return (
    <div
      className={`bg-[url("/images/paint.webp")] h-10 w-35 lg:h-13 lg:w-40 bg-contain bg-no-repeat 
        absolute top-[70%] flex justify-center items-center pb-4 whitespace-nowrap overflow-visible 
        ${options}`}
    >
      {caption}
    </div>
  );
}
