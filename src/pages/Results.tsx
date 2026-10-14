import { Sparkles } from "lucide-react";
import { PageHero, Testimonials, SectionHeader } from "../components/Sections";

const outcomes: Array<[string, string]> = [
  ["Meeting presence", "Speak without mentally rehearsing every sentence."],
  ["Executive tone", "Sound concise, warm and authoritative."],
  ["Spontaneous fluency", "Handle follow-ups and pushback without freezing."],
  ["Career visibility", "Present ideas with enough confidence to be heard."],
];

export default function Results() {
  return (
    <>
      <PageHero
        eyebrow="Student Results"
        title={
          <>
            Confidence you can <em>feel</em> in the room.
          </>
        }
        desc="The strongest proof is what happens when the pressure arrives."
      />
      <Testimonials />
      <section className="section sand">
        <SectionHeader
          eyebrow="Outcome Snapshot"
          title="What changes after 90 days"
        />
        <div className="outcomes">
          {outcomes.map(([title, desc]) => (
            <article key={title}>
              <Sparkles />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
