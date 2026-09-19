import { Navbar } from "@/components/layout/Navbar";
import { SiteEntryLoader } from "@/components/loading/SiteEntryLoader";
import { getPortfolio } from "@/lib/content/portfolio";

export default function PublicLayout({ children }) {
  const { profile, settings } = getPortfolio();

  return (
    <SiteEntryLoader brandLabel={profile.name || profile.brandLabel}>
      <Navbar profile={profile} defaultTheme={settings.defaultTheme} />
      {children}
    </SiteEntryLoader>
  );
}
