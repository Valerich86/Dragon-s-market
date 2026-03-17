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
  src: "../../public/fonts/my/kashima_rus_by_cop.woff2",
});
export const font_asian2 = localFont({
  src: "../../public/fonts/my/kz_taurus.woff2",
});
export const font_asian3 = localFont({
  src: "../../public/fonts/my/takashimura_rus.woff2",
});

// export const font_default = Roboto_Condensed({
//   weight: "400",
// });

export const font_decor = Great_Vibes({
  weight: "400",
});

export const font_accent = localFont({
  src: "../../public/fonts/grato/Grato Grotesk-Regular-Web.ttf",
});

export const font_default = localFont({
  src: "../../public/fonts/grato/Grato Grotesk-Regular-Web.ttf",
});

export const font_bold = localFont({
  src: "../../public/fonts/grato/Grato Grotesk-Bold-Web.ttf",
});

export const font_light = localFont({
  src: "../../public/fonts/grato/Grato Grotesk-Light-Web.ttf",
});

// export const font_accent = Montserrat_Alternates({
//   weight: "700",
// });

export const font_mg = localFont({
  src: "../../public/fonts/milligram/Milligram-Text-Bold-trial.ttf",
});

export const font_montserrat = localFont({
  src: "../../public/fonts/montserrat/Montserrat-Black.ttf",
});

