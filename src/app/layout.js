import "./globals.css";

export const metadata = {
  title: "Quantii POS System",
  description: "A modern Point of Sale system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
