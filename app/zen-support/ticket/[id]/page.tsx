import { redirect } from "next/navigation";

export default async function ZenSupportTicketRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/support/${id}`);
}
