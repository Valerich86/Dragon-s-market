interface Props {
  onClick: () => void;
  optional?: string;
  text: string;
}

export default function CustomButton({ onClick, optional, text }: Props) {

  return (
    <button
      onClick={onClick}
      className={`${optional} bg-accent py-2 
          p-2 rounded text-primary hover:shadow-[0px_0px_20px_-5px_#E23324] 
          theme-5:hover:shadow-[0px_0px_20px_-5px_#591628] transition duration-200 
          cursor-pointer outline-none active:scale-98`}
    >
      {text}
    </button>
  );
}
