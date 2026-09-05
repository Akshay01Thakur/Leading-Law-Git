import { icons } from "../data";
import { toWhatsAppNumber } from "../lib/phone";

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
  }>;
}) {
  const params = await searchParams;
  const name = params.name ?? "";
  const phone = params.phone ?? "";
  const category = params.category ?? "";
  const city = params.city ?? "";
  const language = params.language ?? "";
  const urgency = params.urgency ?? "";
  const issue = params.issue ?? "";

  const hasCustomerPhone = phone.trim().length > 0;
  const confirmationMessage = [
    `Hi ${name || "there"}, your Leading Law consultation${category ? ` for ${category}` : ""} is confirmed.`,
    "Our advocate will call you shortly on this number to discuss your query.",
    "Thank you for choosing Leading Law.",
  ].join(" ");
  const confirmUrl = `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(confirmationMessage)}`;

  return (
    <main className="mock-page consultation-page">
      <section className="mock-card consultation-card">
        <div className="brand-block">
          <div className="brand-mark">
            <icons.Scale size={26} />
          </div>
          <div>
            <strong>Leading Law</strong>
            <span>Advocate confirmation</span>
          </div>
        </div>

        <p className="eyebrow">Appointment details</p>
        <h1>Confirm This Appointment</h1>
        <p>Review the details below, then tap Confirm to send a WhatsApp confirmation to the customer.</p>

        <div className="mock-grid">
          <div>
            <strong>Name</strong>
            <span>{name || "Not provided"}</span>
          </div>
          <div>
            <strong>Phone</strong>
            <span>{phone || "Not provided"}</span>
          </div>
          <div>
            <strong>Category</strong>
            <span>{category || "Not specified"}</span>
          </div>
          <div>
            <strong>City</strong>
            <span>{city || "Not specified"}</span>
          </div>
          <div>
            <strong>Language</strong>
            <span>{language || "Not specified"}</span>
          </div>
          <div>
            <strong>Urgency</strong>
            <span>{urgency || "Not specified"}</span>
          </div>
        </div>

        {issue && (
          <div className="aid-box">
            <icons.BookOpenCheck size={28} />
            <p>
              <strong>Query: </strong>
              {issue}
            </p>
          </div>
        )}

        {hasCustomerPhone ? (
          <a className="primary-action wide" href={confirmUrl} target="_blank" rel="noreferrer">
            Confirm Appointment on WhatsApp
          </a>
        ) : (
          <p className="field-note error">
            No customer phone number was included in this link, so a confirmation message cannot be sent.
          </p>
        )}
      </section>
    </main>
  );
}
