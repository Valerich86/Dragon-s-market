import { font_default } from "@/lib/fonts";
import { Metadata } from "next";
import Header from "@/components/UI/header";
import Footer from "@/components/UI/footer";
import Decor from "@/components/decor";
import BackButton from "@/components/UI/back-button";
import "./globals.css";
import SparklesAnimation from "@/components/animation/sparkles";
import { getUserInfo } from "@/lib/actions";
import { verifySession } from "@/lib/auth";
import { CartProvider } from "@/context/cart-context";
import UserIdProvider from "@/components/userId-provider";

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
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={`${font_default.className} antialiased`}>
        <UserIdProvider userId={userId}>
          <CartProvider>
            <Header userId={userId} />
            {/* <SparklesAnimation /> */}
            <BackButton />
            <div className={`bg-primary text-secondary`}>{children}</div>
            <Footer />
          </CartProvider>
        </UserIdProvider>
      </body>
    </html>
  );
}
