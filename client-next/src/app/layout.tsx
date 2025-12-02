import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/ui/CookieConsent";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { generateMetadata as generateBaseMetadata, generateOrganizationStructuredData, siteConfig } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = generateBaseMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  url: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <CookieConsent />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
