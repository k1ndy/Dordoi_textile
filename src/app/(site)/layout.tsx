import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingContacts } from "@/components/floating-contacts";
import { getCategories, getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <>
      <Header settings={settings} categories={categories} />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
      <FloatingContacts whatsapp={settings.whatsapp} telegram={settings.telegram} />
    </>
  );
}
