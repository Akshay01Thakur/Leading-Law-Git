import { ConfirmClient } from "./ConfirmClient";

export default async function ConfirmAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    phone?: string;
    category?: string;
    city?: string;
    language?: string;
    urgency?: string;
    issue?: string;
    fee?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="mock-page consultation-page">
      <ConfirmClient
        booking={{
          name: params.name ?? "",
          phone: params.phone ?? "",
          category: params.category ?? "",
          city: params.city ?? "",
          language: params.language ?? "",
          urgency: params.urgency ?? "",
          issue: params.issue ?? "",
          fee: params.fee ?? "",
        }}
      />
    </main>
  );
}
