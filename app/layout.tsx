import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import { resolveLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleProvider } from "@/lib/i18n/provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnnaSutra",
  description: "Digital Platform for Catering Services",
};

/** Root layout with locale provider and font configuration. */
const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("as_locale")?.value);
  const messages = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface text-ink">
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
