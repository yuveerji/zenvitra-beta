import CapacityDashboard from "@/components/events/CapacityDashboard";

export const metadata = {
  title: "Pass Capacity Manager | ZENVITRA",
  description: "Real-time event capacity, pass allocations, checkout holds, and audit logging.",
};

export default async function EventCapacityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CapacityDashboard eventId={id} />;
}
