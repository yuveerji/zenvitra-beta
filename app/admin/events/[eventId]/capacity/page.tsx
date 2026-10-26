import CapacityDashboard from "@/components/events/CapacityDashboard";

export const metadata = {
  title: "Pass Capacity Manager | ZENVITRA",
  description: "Real-time event capacity, pass allocations, checkout holds, and audit logging.",
};

export default async function CapacityPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <CapacityDashboard eventId={eventId} />;
}
