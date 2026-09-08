import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyPageBot",
  description: "Privacy policy and information for MyPageBot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
