import BoutiqueAdminClient from '@/components/BoutiqueAdminClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestion Boutique - RCBA Direction',
  description: 'Administration des réservations de la boutique du club.',
};

export default function BoutiqueAdminPage() {
  return (
    <main className="min-h-screen pt-32 pb-16">
      <BoutiqueAdminClient />
    </main>
  );
}
