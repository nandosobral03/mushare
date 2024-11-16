import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { SignUpModal } from "@/components/modals/SignUpModal";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Mushare - Share Your Music Taste",
  description:
    "Create beautiful album grids and ranked charts from your Spotify library. Share your musical journey with friends.",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/180x180.png",
    },
  ],
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Toaster />
          <NextTopLoader color="#1DB954" />
          {children}
          <SignUpModal />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
