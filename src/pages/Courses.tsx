import { PageHero, Journey, Pricing } from "../components/Sections";

export default function Courses() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title={
          <>
            A 90-day system for <em>real-world fluency.</em>
          </>
        }
        desc="Choose the structure that fits your career, calendar and level of personal support."
      />
      <Journey />
      <Pricing />
      <section className="section">
        <div className="comparison">
          <h2>Which track is right for you?</h2>
          <div className="compare-grid">
            <div>
              <span>Choose Group</span>
              <h3>You learn best with peer energy.</h3>
              <p>
                Great for professionals who want structure, evening routines and
                collaborative simulations.
              </p>
            </div>
            <div>
              <span>Choose 1-on-1</span>
              <h3>You need your communication tailored to your work.</h3>
              <p>
                Best for confidential presentations, flexible scheduling and
                role-specific coaching.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
