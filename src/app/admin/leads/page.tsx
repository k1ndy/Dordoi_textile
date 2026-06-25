import { adminGetLeads } from "@/lib/admin-data";
import { LeadsManager } from "@/components/admin/leads-manager";

export default async function AdminLeadsPage() {
  const leads = await adminGetLeads();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Заявки</h1>
      <p className="mt-1 text-ink-muted">Розничные, оптовые заявки и заявки от селлеров. Нажмите на строку для деталей.</p>
      <div className="mt-6">
        <LeadsManager initialLeads={leads} />
      </div>
    </div>
  );
}
