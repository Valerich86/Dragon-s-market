import { font_default } from "@/lib/fonts";
import { Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import Header from "@/components/UI/header";
import Footer from "@/components/UI/footer";
import Decor from "@/components/decor";
import BackButton from "@/components/UI/back-button";
import "./globals.css";
import SparklesAnimation from "@/components/animation/sparkles";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | %s",
    default: "Драконий базар",
  },
  description: "Драконий базар. Магазин азиатских снеков, город Пермь",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={`${font_default.className} antialiased`}>
        {/* <ThemeProviderWrapper> */}
          <Header />
          {/* <Decor /> */}
          {/* <SparklesAnimation /> */}
          <BackButton />
          <div
            className={`bg-primary text-secondary`}
          >
            {children}
          </div>
          <Footer />
        {/* </ThemeProviderWrapper> */}
      </body>
    </html>
  );
}
