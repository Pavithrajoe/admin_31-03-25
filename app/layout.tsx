
import './globals.css';
export const metadata = {
  title: 'Labs.Inklidox',
  description: 'Your app description',
  icons: {
    icon: "/lab_logo.png", // Path to favicon in the public folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

/*
import "./globals.css";

export const metadata = {
  title: "Labs.Inklidox",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-512x512.png" sizes="512x512" />
        <link rel="icon" href="/favicon-1024x1024.png" sizes="1024x1024" />
        <link rel="icon" href="/favicon-2048x2048.png" sizes="2048x2048" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
*/