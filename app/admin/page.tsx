import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { admin } from "@/components/admin/admin-ui";

export default function AdminPage() {
  return (
    <main className={admin.page}>
      <div className={admin.container}>
        <AdminDashboard />
      </div>
    </main>
  );
}
