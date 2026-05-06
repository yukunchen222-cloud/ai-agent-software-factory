import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "企业级 AI Agent / 程序交付工厂",
  description: "一个用于本地生成客户项目交付包、开发任务、测试验收和上架材料的 Web MVP。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
