interface Props {
  src: string;
  options?: string;
}

export default function DarknedImage({ src, options = "" }: Props) {
  return (
    <div
      style={{  backgroundImage: `url(${src})` }}
      className={`${options} absolute left-0 top-0 bg-cover bg-no-repeat 
        after:absolute after:inset-0 after:bg-linear-to-b after:from-transparent after:to-primary after:to-70%`}
    ></div>
  );
}
