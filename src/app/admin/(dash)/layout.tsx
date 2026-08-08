// Shell de l'administration (sidebar + zone principale).
// Le login (/admin/login) est hors de ce groupe, donc sans shell.
import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import '../admin.css';

export const metadata = { title: 'Administration — PULZ' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="brand">
          <div>
            <b>PULZ</b>
            <div><span>Administration</span></div>
          </div>
        </div>
        <AdminNav />
        <div className="foot">
          <Link href="/" style={{ color: '#8FB0D0' }}>← Voir le site</Link>
        </div>
      </aside>
      <div className="adm-main">{children}</div>
    </div>
  );
}
