interface Props {
  src: string;
  options?: string;
}

export default function DarknedImage({ src, options = "" }: Props) {
  return (
    <div
      style={{  backgroundImage: `url(${src})` }}
      className={`${options} absolute hidden dark:block left-0 top-0 bg-cover bg-no-repeat 
        after:absolute after:inset-0 after:bg-black after:opacity-65 after:md:opacity-85`}
    ></div>
  );
}
