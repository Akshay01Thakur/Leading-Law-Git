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

export const lawyers: Lawyer[] = [
  {
    slug: "vivek-yadav",
    name: "Adv. Vivek Yadav",
    initials: "VY",
    city: "Delhi NCR",
    court: "Delhi High Court • District Courts • Delhi NCR",
    areas: [
      "Property & Real Estate",
      "RERA",
      "Consumer Disputes",
      "Civil Litigation",
      "Commercial Recovery",
      "Banking & Finance",
      "Documentation & Agreements",
    ],
    languages: ["English", "Hindi"],
    years: 20,
    experienceLabel: "20+ Years Experience",
    response: 98,
    activity: 94,
    feedback: 4.9,
    profileUpvotes: 2190,
    chat: 35,
    call: 70,
    fixed: 999,
    verified: "Verified Bar Registration",
    bio: "Adv. Vivek Yadav is a verified advocate practising before the Delhi High Court, District Courts and various legal forums across Delhi NCR. He advises clients in Property, RERA, Consumer, Civil and Commercial disputes with a practical, solution-oriented approach focused on achieving timely legal outcomes.",
    whatsapp: "918700843886",
    calendarEmail: "vivek.yadav@leadinglaw.example",
  },
];

export const lawyerOfTheWeekSlug = "vivek-yadav";

export function getLawyer(slug: string) {
  return lawyers.find((lawyer) => lawyer.slug === slug);
}
