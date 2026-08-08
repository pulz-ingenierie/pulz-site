// PAGE CONTACT — formulaire relié (sujets depuis la base)
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import { createClient } from '@/lib/supabase-server';

export const revalidate = 300;

export default async function ContactPage() {
  const sb = createClient();
  const { data: routes } = await sb.from('routage_contact').select('sujet').order('ordre');
  const sujets = (routes ?? []).map((r: any) => r.sujet);

  return (
    <>
      <Nav />
      <header style={{ background: 'linear-gradient(180deg,#fff,var(--paper-2))', padding: '76px 0 44px' }}>
        <div className="wrap">
          <span className="eyebrow">Contact</span>
          <div className="fluo" style={{ marginTop: 16 }} />
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-.035em', color: 'var(--deep)', maxWidth: '20ch' }}>
            Parlons de votre <span style={{ color: 'var(--blue)', display: 'inline-block', filter: 'drop-shadow(0 10px 10px rgba(30,99,196,.28))' }}>projet</span>
          </h1>
        </div>
      </header>
      <section style={{ background: 'var(--paper-2)', padding: '56px 0 90px' }}>
        <div className="wrap" style={{ maxWidth: 920 }}>
          <ContactForm sujets={sujets} blue />
        </div>
      </section>
      <Footer />
    </>
  );
}
