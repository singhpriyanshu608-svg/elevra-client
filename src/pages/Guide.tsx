import { Check, Download } from "lucide-react";
import { PageHero, Testimonials } from "../components/Sections";

export default function Guide() {
  const items = [
    "Boardroom phrases for entering and redirecting conversations",
    "Executive email templates",
    "Filler-word reset drills",
    "Vocabulary for disagreement and pushback",
    "A 7-day speaking confidence reset",
  ];
  return (
    <>
      <PageHero
        eyebrow="Guide Book"
        title={
          <>
            Your pocket guide to <em>executive English.</em>
          </>
        }
        desc="A practical resource for sounding clearer, more concise and more confident at work."
      />
      <section className="section guide-card">
        <div className="guide-cover">
          <span>elevr.a</span>
          <h2>
            The Executive
            <br />
            Communication Guide
          </h2>
          <small>English With Kanika</small>
        </div>
        <div>
          <span className="eyebrow">Inside the guide</span>
          <h2>Small changes. Big difference.</h2>
          <ul>
            {items.map((x) => (
              <li key={x}>
                <Check />
                {x}
              </li>
            ))}
          </ul>
          <button className="btn">
            <Download size={17} /> Download Companion Guide
          </button>
        </div>
      </section>
      <Testimonials />
    </>
  );
}
