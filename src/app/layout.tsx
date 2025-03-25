export const metadata = {
  title: 'Piggi-pal',
  description: 'Piggi-pal app',
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
