
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import MainLayout from "../components/templates/MainLayout";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Easy Web Builder - 웹사이트를 쉽게 만들어보세요",
  description: "Easy Web Builder로 쉽고 빠르게 웹사이트를 제작해보세요.",
};

export default  function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
    <head>
      <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
      />
      <link
          href="https://ai-public.creatie.ai/gen_page/tailwind-custom.css"
          rel="stylesheet"
      />
      <script
          src="https://cdn.tailwindcss.com/3.4.5?plugins=forms@0.5.7,typography@0.5.13,aspect-ratio@0.4.2,container-queries@0.1.1"
          defer
      ></script>
      <script
          src="https://ai-public.creatie.ai/gen_page/tailwind-config.min.js"
          data-color="#000000"
          data-border-radius="small"
          defer
      ></script>
    </head>
    <body className={`min-h-screen bg-gray-50 ${notoSansKr.className}`}>
    <Providers>
      <MainLayout>{children}</MainLayout>
    </Providers>
    </body>
    </html>
  );
}
