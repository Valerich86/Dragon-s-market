import localFont from "next/font/local";
import {
  Hachi_Maru_Pop,
  Roboto,
  Roboto_Condensed,
  Cormorant_Infant,
  Comforter,
  Great_Vibes,
  Playfair_Display_SC,
  Montserrat_Alternates
} from "next/font/google";

export const font_asian1 = localFont({
  src: "../../public/fonts/kashima_rus_by_cop.woff2",
});
export const font_asian2 = localFont({
  src: "../../public/fonts/kz_taurus.woff2",
});
export const font_asian3 = localFont({
  src: "../../public/fonts/takashimura_rus.woff2",
});

export const font_default = Roboto_Condensed({
  weight: "400",
});

export const font_decor = Great_Vibes({
  weight: "400",
});

export const font_accent = localFont({
  src: "../../public/fonts/gratogroteskdemo-bold.woff2",
});

// export const font_accent = Montserrat_Alternates({
//   weight: "700",
// });

