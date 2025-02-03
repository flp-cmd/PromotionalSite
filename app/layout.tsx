import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "react-hot-toast";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <Provider>{children}</Provider>
        <Toaster/>
      </body>
    </html>
  );
}
