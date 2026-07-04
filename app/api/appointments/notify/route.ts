type AppointmentNotificationRequest = {
  bookingId?: string;
  lawyerName?: string;
  lawyerWhatsApp?: string;
  category?: string;
  mode?: string;
  date?: string;
  start?: string;
  end?: string;
  meetingCode?: string;
  amount?: number;
  paymentProvider?: string;
};

const monthNumber: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

function calendarStamp(dateLabel = "6 Jul 2026", timeLabel = "12:00 PM") {
  const [day = "6", month = "Jul", year = "2026"] = dateLabel.split(" ");
  const [clock = "12:00", meridiem = "PM"] = timeLabel.split(" ");
  const [rawHour = "12", rawMinute = "00"] = clock.split(":");
  let hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (meridiem.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0;

  return `${year}${monthNumber[month] ?? "07"}${day.padStart(2, "0")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
}

function maskPhone(phone: string) {
  if (phone.length < 8) return phone;
  return `+${phone.slice(0, 2)} ${phone.slice(2, 4)}****${phone.slice(-2)}`;
}

function buildCalendarUrl(payload: AppointmentNotificationRequest) {
  const modeLabel = payload.mode === "video" ? "Google Meet consultation" : "Direct call consultation";
  const title = `LegalSeva appointment: ${payload.category ?? "Legal consultation"}`;
  const details = [
    `Booking: ${payload.bookingId ?? "LegalSeva booking"}`,
    `Lawyer: ${payload.lawyerName ?? "Adv Vivek Yadav"}`,
    `Mode: ${modeLabel}`,
    payload.meetingCode && payload.mode === "video" ? `Meet: https://${payload.meetingCode}` : "Direct call will be initiated by LegalSeva.",
    `Payment: ${payload.paymentProvider ?? "Payment gateway"} - Rs ${payload.amount ?? 0}`,
  ].join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${calendarStamp(payload.date, payload.start)}/${calendarStamp(payload.date, payload.end)}`,
    details,
    ctz: "Asia/Kolkata",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AppointmentNotificationRequest;
  const lawyerName = payload.lawyerName ?? "Adv Vivek Yadav";
  const lawyerWhatsApp = payload.lawyerWhatsApp ?? "919999000111";
  const calendarUrl = buildCalendarUrl(payload);
  const modeLabel = payload.mode === "video" ? "Google Meet" : "direct call";
  const message = [
    `New LegalSeva appointment for ${lawyerName}.`,
    `Booking ${payload.bookingId ?? "confirmed"}: ${payload.category ?? "Legal consultation"} via ${modeLabel}.`,
    `${payload.date ?? "6 Jul 2026"}, ${payload.start ?? "12:00 PM"} - ${payload.end ?? "3:00 PM"}.`,
    `Add to Google Calendar: ${calendarUrl}`,
  ].join(" ");

  return Response.json({
    status: "queued",
    channel: "whatsapp",
    template: "legalseva_new_appointment_v1",
    to: lawyerName,
    toMasked: maskPhone(lawyerWhatsApp),
    calendarUrl,
    whatsappUrl: `https://wa.me/${lawyerWhatsApp}?text=${encodeURIComponent(message)}`,
    messagePreview: message,
  });
}
