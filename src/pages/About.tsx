import { PageHero } from "../components/Sections";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Kanika"
        title={
          <>
            The coach behind the <em>confidence.</em>
          </>
        }
        desc="Elevra combines Cambridge-aligned pedagogy with practical executive communication coaching."
      />
      <section className="section about-grid">
        <div className="about-portrait">
          <div className="portrait large">K</div>
          <span>Cambridge Certified Coach</span>
        </div>
        <div>
          <span className="eyebrow">The philosophy</span>
          <h2>Stop studying English. Start using it under pressure.</h2>
          <p>
            Kanika’s approach is built around the situations that matter at
            work: boardroom articulation, spontaneous questions, presentations,
            negotiation, client conversations and concise writing.
          </p>
          <p>
            Every session prioritises active speaking, micro-corrections and
            realistic simulations so progress shows up where it counts — in the
            room.
          </p>
          <div className="signature">
            Kanika <small>English With Kanika</small>
          </div>
        </div>
      </section>
    </>
  );
}
