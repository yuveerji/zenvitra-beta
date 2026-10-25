import { redirect } from 'next/navigation';

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dias/${id || 'IF8RV5'}`);
}
