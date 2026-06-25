import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Настройки сайта</h1>
      <p className="mt-1 text-ink-muted">Контакты, доставка, оплата и тексты на сайте.</p>
      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
