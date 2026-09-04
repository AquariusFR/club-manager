import { getSession } from '@/lib/authentication';
import BoutiqueClient from '@/components/BoutiqueClient';

export default async function BoutiquePage() {
  const session = await getSession();

  return <BoutiqueClient session={session} />;
}
