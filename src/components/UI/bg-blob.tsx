interface Props {
  src: string;
  options?: string;
}

export default function BGBlob({ src, options = "" }: Props) {
  return (
    <div className="fixed w-full h-screen hidden blob:block opacity-50">
      <div
        style={{ backgroundImage: `url(${src})` }}
        className={`
         w-full h-full bg-right lg:translate-x-[20%] translate-y-[30%] bg-no-repeat bg-size-[250%] lg:bg-size-[80%] ${options}`}
      ></div>
      <div
        style={{ backgroundImage: `url(${src})` }}
        className={`bg-size-[130%] bg-no-repeat w-full h-full bg-center translate-x-[20%] -translate-y-[140%] lg:hidden`}
      ></div>
    </div>
  );
}
