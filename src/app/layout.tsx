import type { Metadata } from "next";
import { font_default } from "@/lib/fonts";
import Header from "@/components/UI/header";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import "./globals.css";
import Footer from "@/components/UI/footer";
import Decor from "@/components/decor";
import BackButton from "@/components/UI/back-button";

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
        <ThemeProviderWrapper>
          {/* <Breadcrumbs /> */}
          <Header />
          <Decor />
          <BackButton />
          <div
            className={`
            dark:bg-secondary dark:text-primary blob:bg-primary blob:text-secondary 
            fire:text-primary fire:bg-linear-to-r from-black  to-maskot3`}
          >
            {children}
          </div>
          <Footer />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
