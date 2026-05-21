import "./globals.css";
import { font_default } from "@/lib/fonts";
import { Metadata } from "next";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import BackButton from "@/components/UI/back-button";
import { getUserInfo } from "@/lib/server-data";
import { verifySession } from "@/lib/auth";
import { CartProvider } from "@/context/cart-context";
import CookieNotification from "@/components/UI/cookie-notification";
import { AccessibilityProvider } from "@/components/providers/accessibility-provider";
import { AccessibilityStyles } from "@/components/UI/accessibility-styles ";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | %s",
    default: "Драконий базар",
  },
  description: "Драконий базар. Магазин азиатских снеков, город Пермь",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userId = 0;
  const session = await verifySession();
  if (session) {
    const { user } = await getUserInfo(session.userId);
    userId = user?.general.id;
  }

  return (
    <html lang="en" 
    // suppressHydrationWarning
    >
      <head></head>
      <AccessibilityProvider>
        <body className={`${font_default.className} antialiased`}>
          <AccessibilityStyles />
          <CartProvider>
            <Header userId={userId} />
            <BackButton />
            <div className={`bg-primary text-secondary text-base`}>
              {children}
            </div>
            <Footer />
            <CookieNotification />
          </CartProvider>
        </body>
      </AccessibilityProvider>
    </html>
  );
}
