import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { Toaster } from 'react-hot-toast';

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
