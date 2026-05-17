export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Sports Master Sports Day</h1>
        </header>
        {children}
      </body>
    </html>
  );
}