import "./globals.css";

export const metadata = {
  title: "Quantii POS System",
  description: "A modern Point of Sale system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quantii POS"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png"
  }
};

export const viewport = {
  themeColor: "#000000"
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
