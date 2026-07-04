import {
  Activity,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Gavel,
  Globe2,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Phone,
  Scale,
  ShieldCheck,
  Star,
  UserCheck,
  Video,
} from "lucide-react";

export type Role = "consumer" | "lawyer" | "admin";

export type Lawyer = {
  slug: string;
  name: string;
  initials: string;
  city: string;
  court: string;
  areas: string[];
  languages: string[];
  years: number;
  response: number;
  activity: number;
  feedback: number;
  profileUpvotes: number;
  experienceLabel?: string;
  chat: number;
  call: number;
  fixed: number;
  verified: string;
  bio: string;
  whatsapp?: string;
  calendarEmail?: string;
};

export type QuestionTopic = {
  slug: string;
  question: string;
  topic: string;
  ai: string;
  lawyerSlug: string;
  human: string;
  citations: string[];
  reads: string;
  upvotes: number;
};

export type ConsultationSlot = {
  id: string;
  date: string;
  day: string;
  label: string;
  start: string;
  end: string;
  status: "available" | "court-blocked" | "booked";
  reason?: string;
};

export type CourtBlock = {
  caseNo: string;
  court: string;
  matter: string;
  date: string;
  time: string;
};

export const icons = {
  Activity,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Gavel,
  Globe2,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  MessageSquareText,
  Phone,
  Scale,
  ShieldCheck,
  Star,
  UserCheck,
  Video,
};

export const categories = [
  "Family / Divorce",
  "Property / RERA",
  "Criminal / Bail",
  "Cyber Fraud",
  "Consumer Complaint",
  "Cheque Bounce",
  "Employment / Labour",
  "Startup / Compliance",
  "NRI Property",
  "Recovery Case",
  "Arbitration",
];

export const cities = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad"];

export const languages = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
  "Urdu",
];

export const consultationSlots: ConsultationSlot[] = [
  {
    id: "mon-0900",
    date: "6 Jul 2026",
    day: "Mon",
    label: "Morning",
    start: "9:00 AM",
    end: "12:00 PM",
    status: "court-blocked",
    reason: "District Court appearance",
  },
  {
    id: "mon-1200",
    date: "6 Jul 2026",
    day: "Mon",
    label: "Midday",
    start: "12:00 PM",
    end: "3:00 PM",
    status: "available",
  },
  {
    id: "mon-1500",
    date: "6 Jul 2026",
    day: "Mon",
    label: "Afternoon",
    start: "3:00 PM",
    end: "6:00 PM",
    status: "available",
  },
  {
    id: "tue-0900",
    date: "7 Jul 2026",
    day: "Tue",
    label: "Morning",
    start: "9:00 AM",
    end: "12:00 PM",
    status: "booked",
    reason: "Existing LegalSeva consultation",
  },
  {
    id: "tue-1500",
    date: "7 Jul 2026",
    day: "Tue",
    label: "Afternoon",
    start: "3:00 PM",
    end: "6:00 PM",
    status: "available",
  },
  {
    id: "wed-1800",
    date: "8 Jul 2026",
    day: "Wed",
    label: "Evening",
    start: "6:00 PM",
    end: "9:00 PM",
    status: "available",
  },
];

export const courtBlocks: CourtBlock[] = [
  {
    caseNo: "CS/214/2026",
    court: "Delhi District Court",
    matter: "Property injunction hearing",
    date: "6 Jul 2026",
    time: "9:00 AM - 12:00 PM",
  },
  {
    caseNo: "BA/78/2026",
    court: "Bombay High Court",
    matter: "Bail application listing",
    date: "7 Jul 2026",
    time: "12:00 PM - 3:00 PM",
  },
  {
    caseNo: "RERA/552/2026",
    court: "Karnataka RERA Authority",
    matter: "Delayed possession complaint",
    date: "8 Jul 2026",
    time: "9:00 AM - 12:00 PM",
  },
];

export const lawyers: Lawyer[] = [
  {
    slug: "vivek-yadav",
    name: "Adv Vivek Yadav",
    initials: "VY",
    city: "Delhi NCR",
    court: "Delhi High Court, District Courts and all Delhi NCR courts",
    areas: categories,
    languages: ["English", "Hindi"],
    years: 4,
    experienceLabel: "2-5 years",
    response: 97,
    activity: 94,
    feedback: 4.8,
    profileUpvotes: 2190,
    chat: 35,
    call: 70,
    fixed: 999,
    verified: "Registered for Delhi HC, District Courts and all Delhi NCR courts",
    bio: "LegalSeva Lawyer of the Week. Delhi NCR advocate focused on practical first consultation, document review and clear next-step planning for consumers.",
    whatsapp: "919999000111",
    calendarEmail: "vivek.yadav@legalseva.example",
  },
  {
    slug: "meera-sanyal",
    name: "Adv. Meera Sanyal",
    initials: "MS",
    city: "Delhi NCR",
    court: "Delhi High Court, District Courts",
    areas: ["Family / Divorce", "Domestic Violence", "Child Custody"],
    languages: ["English", "Hindi", "Punjabi"],
    years: 14,
    response: 98,
    activity: 92,
    feedback: 4.8,
    profileUpvotes: 1284,
    chat: 35,
    call: 65,
    fixed: 999,
    verified: "Bar Council enrollment verified",
    bio: "Matrimonial and family-law advocate focused on document-led consultation, safety-sensitive escalation, and clear next-step planning.",
  },
  {
    slug: "arjun-rao",
    name: "Adv. Arjun Rao",
    initials: "AR",
    city: "Bengaluru",
    court: "Karnataka High Court, RERA Authority",
    areas: ["Property / RERA", "NRI Property", "Consumer Complaint"],
    languages: ["English", "Kannada", "Hindi"],
    years: 18,
    response: 93,
    activity: 88,
    feedback: 4.7,
    profileUpvotes: 947,
    chat: 40,
    call: 75,
    fixed: 1299,
    verified: "State bar and court practice declared",
    bio: "Property, RERA and NRI property counsel with a strong intake practice around agreements, payment trails and jurisdiction checks.",
  },
  {
    slug: "farah-khan",
    name: "Adv. Farah Khan",
    initials: "FK",
    city: "Mumbai",
    court: "Bombay High Court, Magistrate Courts",
    areas: ["Criminal / Bail", "Cyber Fraud", "Cheque Bounce", "Recovery Case"],
    languages: ["English", "Hindi", "Urdu", "Marathi"],
    years: 11,
    response: 96,
    activity: 95,
    feedback: 4.9,
    profileUpvotes: 1516,
    chat: 45,
    call: 85,
    fixed: 1499,
    verified: "Enrollment and identity verified",
    bio: "Criminal procedure and cyber-fraud advocate handling urgent police-process, bank-freeze and cheque-bounce triage.",
  },
  {
    slug: "r-narayanan",
    name: "Adv. R. Narayanan",
    initials: "RN",
    city: "Chennai",
    court: "Madras High Court, Labour Courts",
    areas: ["Employment / Labour", "Startup / Compliance", "Consumer Complaint", "Arbitration", "Recovery Case"],
    languages: ["English", "Tamil", "Hindi"],
    years: 22,
    response: 89,
    activity: 84,
    feedback: 4.6,
    profileUpvotes: 831,
    chat: 30,
    call: 70,
    fixed: 1199,
    verified: "Bar and practice details reviewed",
    bio: "Employment, compliance and contract-review advocate with long-form advisory experience for workers, founders and MSMEs.",
  },
];

export const lawyerOfTheWeekSlug = "vivek-yadav";

export const qaTopics: QuestionTopic[] = [
  {
    slug: "bank-account-frozen-cyber-complaint",
    question: "Can my bank account be frozen after a cyber fraud complaint?",
    topic: "Cyber Fraud",
    ai: "A freeze may happen during investigation. Preserve complaint numbers, bank messages, transaction IDs and speak to an advocate if funds are blocked or police contact you.",
    lawyerSlug: "farah-khan",
    human:
      "Do not ignore bank or police notices. The next step depends on whether you are the complainant, beneficiary, or alleged mule account holder.",
    citations: ["IT Act, 2000", "BNS/BNSS, 2023", "DPDP Act, 2023"],
    reads: "42.1k",
    upvotes: 312,
  },
  {
    slug: "builder-delayed-possession",
    question: "What can I do if a builder delays possession of my flat?",
    topic: "Property / RERA",
    ai: "Check registration, allotment letter, builder-buyer agreement, payment schedule and possession clause. RERA may be relevant for delay remedies.",
    lawyerSlug: "arjun-rao",
    human: "RERA timelines and the agreement both matter. Keep proof of payments and all delay communications.",
    citations: ["RERA, 2016", "Consumer Protection Act, 2019"],
    reads: "36.7k",
    upvotes: 274,
  },
  {
    slug: "maintenance-if-spouse-earns",
    question: "Can I ask for maintenance if my spouse is also earning?",
    topic: "Family / Divorce",
    ai: "Maintenance depends on facts such as income, standard of living, dependents and court assessment. It should be reviewed with documents.",
    lawyerSlug: "meera-sanyal",
    human: "Salary alone does not decide the answer. Courts look at capacity, needs and fairness.",
    citations: ["Hindu Marriage Act, 1955", "Domestic Violence Act, 2005"],
    reads: "51.4k",
    upvotes: 421,
  },
  {
    slug: "cheque-bounce-time-limit",
    question: "What is the time limit after a cheque bounce?",
    topic: "Cheque Bounce",
    ai: "Cheque bounce matters are deadline-sensitive. Preserve the return memo and consult quickly before sending or replying to notice.",
    lawyerSlug: "farah-khan",
    human: "Missing limitation windows can harm the case. Get the memo and notice dates checked.",
    citations: ["Negotiable Instruments Act, 1881, Section 138"],
    reads: "28.9k",
    upvotes: 198,
  },
];

export function getLawyer(slug: string) {
  return lawyers.find((lawyer) => lawyer.slug === slug);
}

export function scoreLawyer(lawyer: Lawyer) {
  return Math.round(lawyer.response * 0.35 + lawyer.activity * 0.25 + Math.min(lawyer.years, 25) * 1.2 + lawyer.feedback * 8);
}
