// The payable fee also drives the UPI deep-link amount, so this must always be
// the number the customer actually transfers.
export const consultationFee = process.env.NEXT_PUBLIC_CONSULTATION_FEE ?? "99";

// The pre-discount price, shown struck through next to the payable fee.
export const consultationFeeBefore = process.env.NEXT_PUBLIC_CONSULTATION_FEE_BEFORE ?? "499";

function toAmount(value: string) {
  const amount = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

const before = toAmount(consultationFeeBefore);
const payable = toAmount(consultationFee);

// Only advertise a discount when the "before" price is genuinely higher. A
// misconfigured env var would otherwise show a struck-through price identical to
// the payable one, or claim a negative saving.
export const hasConsultationDiscount = before > payable;
export const consultationSaving = hasConsultationDiscount ? String(before - payable) : "";
