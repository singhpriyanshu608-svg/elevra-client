import { useState, type FormEvent } from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/Layout";
import { DemoVideo, PageHero } from "../components/Sections";

export default function Demo() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  const points = [
    "Live 1-on-1 on Google Meet",
    "Real-time personalised feedback",
    "A diagnosis of your speaking blocks",
    "A suggested 90-day roadmap",
  ];

  return (
    <>
      <PageHero
        eyebrow="Free Demo"
        title={
          <>
            Reserve your live <em>1-on-1 demo.</em>
          </>
        }
        desc="30 minutes. Real feedback. No webinar, no aggressive sales pitch."
      />
      <section className="section demo-wrap">
        <div className="demo-info">
          <span className="eyebrow">What happens inside</span>
          <h2>Leave with clarity, not another sales pitch.</h2>
          {points.map((x) => (
            <div className="demo-point" key={x}>
              <Check />
              {x}
            </div>
          ))}
          <div className="privacy">
            <ShieldCheck /> No spam. No marketing calls.
          </div>
        </div>
        {sent ? (
          <div className="success-card">
            <Sparkles />
            <h2>Spot Reserved!</h2>
            <p>
              Your demo request is in. A counselor will confirm your Google Meet
              link.
            </p>
            <Button to="#why-elevra">Back to Home</Button>
          </div>
        ) : (
          <form className="demo-form" onSubmit={submit}>
            <label>
              Full Name
              <input required placeholder="Your name" />
            </label>
            <label>
              Profession / Role
              <input required placeholder="e.g. Product Manager" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              WhatsApp Number
              <input required placeholder="+91" />
            </label>
            <div className="form-row">
              <label>
                Format
                <select>
                  <option>1-on-1 VIP</option>
                  <option>Group Cohort</option>
                </select>
              </label>
              <label>
                Slot
                <select>
                  <option>Morning (9–12)</option>
                  <option>Evening (6–9)</option>
                </select>
              </label>
            </div>
            <label>
              Primary Goal
              <select>
                <option>Freeze in meetings</option>
                <option>Executive tone</option>
                <option>Client calls & presentations</option>
                <option>Authoritative emails</option>
                <option>General confidence</option>
              </select>
            </label>
            <button className="btn" type="submit">
              Reserve My Demo Spot
            </button>
          </form>
        )}
      </section>
      <DemoVideo />
    </>
  );
}
