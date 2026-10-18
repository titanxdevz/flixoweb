import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0E0919",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://flixo.fun"),
  title: "Flixo — Discord music bot with lossless sound and live filters",
  description:
    "Flixo streams 384kbps lossless audio to Discord with 14 live DSP filters, Spotify & Last.fm sync, and 24/7 playback.",
  icons: {
    icon: "/flixo-avatar.png",
    apple: "/flixo-avatar.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className="bg-[#0E0919] text-[#FFFFFF] min-h-screen selection:bg-[#FF5CAA] selection:text-white">
        {children}
      </body>
    </html>
  );
}
