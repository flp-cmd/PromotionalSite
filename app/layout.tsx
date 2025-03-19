import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { Roboto } from "next/font/google";
import ToasterClient from "@/components/common/ToasterClient";
import { Analytics } from "@vercel/analytics/next";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={roboto.className}>
        <Provider>{children}</Provider>
        <ToasterClient />
        <Analytics />
      </body>
    </html>
  );
}
