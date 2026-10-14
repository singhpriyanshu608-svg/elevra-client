import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Button } from "../components/Layout";
import { PageHero } from "../components/Sections";

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let’s make your next conversation <em>easier.</em>
          </>
        }
        desc="Questions about programs, corporate sponsorships or the right track? Reach out."
      />
      <section className="section contact-grid">
        <div>
          <span className="eyebrow">Reach Kanika</span>
          <h2>Tell us what you’re working towards.</h2>
          <p>
            We’ll help you choose between the cohort and 1-on-1 experience, or
            answer any questions about the demo.
          </p>
        </div>
        <div className="contact-card">
          <a href="mailto:kanika@elevra.in">
            <Mail />
            <span>
              <small>Email</small>kanika@elevra.in
            </span>
          </a>
          <a href="https://wa.me/918700276743">
            <MessageCircle />
            <span>
              <small>WhatsApp</small>+91 87002 76743
            </span>
          </a>
          <a href="https://instagram.com/elevr.a">
            <Instagram />
            <span>
              <small>Instagram</small>@elevr.a
            </span>
          </a>
          <Button to="#demo">Book a Free Demo</Button>
        </div>
      </section>
    </>
  );
}
