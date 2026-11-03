import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "입금 소명 지원",
  description: "원치 않은 의심 입금의 온체인 사실과 사용자 진술을 정리하는 도구",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
