// Page admin — gestion de la bibliothèque de logos clients.
import LogosManager from '@/components/admin/LogosManager';

export const dynamic = 'force-dynamic';

export default function LogosAdminPage() {
  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Logos clients</h1>
          <div className="sub">Bibliothèque partagée (bandes « Ils nous font confiance » + références)</div>
        </div>
      </div>
      <div className="adm-body">
        <LogosManager />
      </div>
    </>
  );
}
