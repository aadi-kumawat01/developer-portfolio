import Script from "next/script";
import { getPortfolio } from "@/lib/content/portfolio";
import "./globals.css";

const { settings } = getPortfolio();

export const metadata = {
  title: settings.title,
  description: settings.description,
};

const themeBootstrap = `
(function () {
  try {
    var savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.dataset.theme = savedTheme;
      document.documentElement.dataset.themeChoice = savedTheme;
    }
  } catch {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme={settings.defaultTheme}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeBootstrap,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
