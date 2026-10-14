import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  Download,
  GraduationCap,
  Mic2,
  Target,
  Zap,
} from "lucide-react";

export type Feature = [title: string, description: string, icon: LucideIcon];
export type JourneyStep = {
  month: string;
  title: string;
  sub: string;
  items: string[];
};
export type FAQ = [question: string, answer: string];
export type Testimonial = [name: string, role: string, quote: string];

export const features: Feature[] = [
  [
    "Flexible Corporate Timings",
    "Morning, afternoon, evening or weekend batches with easy rescheduling.",
    Clock3,
  ],
  [
    "75% Live Speaking Time",
    "No passive lectures — active speaking, debate and instant feedback.",
    Mic2,
  ],
  [
    "Real Boardroom Simulations",
    "Practice CXO pitches, tough client questions, negotiations and global calls.",
    Target,
  ],
  [
    "Eliminate Freeze & Fillers",
    "Build direct English thinking so hesitation and filler words stop controlling you.",
    Zap,
  ],
  [
    "Cambridge Framework & Certificate",
    "A structured 90-day pathway with a completion certificate.",
    GraduationCap,
  ],
  [
    "Lifetime Executive Resource Vault",
    "Templates, vocabulary decks, cheat-sheets and alumni resources.",
    Download,
  ],
];

export const journey: JourneyStep[] = [
  {
    month: "MONTH 01",
    title: "Speak Without Fear or Freezing",
    sub: "Mindset + native thought formulation",
    items: [
      "Think directly in English",
      "Daily live drills with micro-corrections",
      "Pronunciation & vocal flow",
      "Remove blank freezes and fillers",
    ],
  },
  {
    month: "MONTH 02",
    title: "Sound Like a Corporate Professional",
    sub: "Executive vocabulary + meeting decorum",
    items: [
      "150+ workplace phrases & idioms",
      "Scrums, client calls & updates",
      "Pace, pitch, tone and projection",
      "Executive email writing",
    ],
  },
  {
    month: "MONTH 03",
    title: "Lead with Poise & Authority",
    sub: "Presence + persuasion + presentation",
    items: [
      "Pitch ideas and handle pushback",
      "Interview & storytelling frameworks",
      "Non-verbal executive presence",
      "Final benchmark assessment + certificate",
    ],
  },
];

export const faqs: FAQ[] = [
  [
    "Grammar is weak, will this help?",
    "Yes. Grammar is fixed inside real conversations and professional emails, not school rules.",
  ],
  [
    "What if I miss a class?",
    "1-on-1 sessions can be rescheduled. Group learners receive recap notes, recordings and revision slots.",
  ],
  [
    "What happens in the Free Demo?",
    "It is a live 1-on-1 Google Meet. Kanika or a senior trainer diagnoses your speaking blocks, gives instant feedback and maps your 90-day plan.",
  ],
  [
    "How is Elevra different?",
    "The focus is executive presence, negotiation, presentations and natural thinking in English, with 75% of class time spent speaking.",
  ],
  [
    "Will I receive a certificate?",
    "Yes. You receive an Elevra Certificate of Completion aligned with the Cambridge CEFR framework after the 90-day pathway and final evaluation.",
  ],
];

export const testimonials: Testimonial[] = [
  [
    "Ankit Kapoor",
    "Associate Director, Deloitte",
    "I just gave my first keynote to the London leadership team. Not once did I fumble or search for words…",
  ],
  [
    "Shreya Nair",
    "Product Manager, Amazon",
    "Other institutes made me write grammar rules. Elevra’s 1-on-1 drills on thinking in English actually re-wired my speaking.",
  ],
  [
    "Vikas Sharma",
    "Staff Engineer, Microsoft",
    "The Cambridge framework and mock boardroom interviews gave me the confidence I needed. Cleared my L5 interview with zero anxiety.",
  ],
];
