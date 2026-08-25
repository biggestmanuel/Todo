import './globals.css';

export const metadata = {
  title: 'Todo — Deadlines',
  description: 'A minimal todo app with deadlines, built on Next.js + Supabase.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
