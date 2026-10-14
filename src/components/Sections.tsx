import { useState, type ReactNode, type FormEvent } from 'react';
import { AlertCircle, ArrowRight, Check, ChevronDown, Download, Instagram, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, Star, Users, X } from 'lucide-react';
import { features, journey, faqs, testimonials } from '../data/siteData';
import { Button } from './Layout';

// Image imports
import heroEditorial from '../Images/hero_editorial.jpg.jpeg';
import kanikaPortrait from '../Images/kanika_portrait.jpg.jpeg';
import kanikaAvatar from '../Images/kanika_avatar.jpg.jpeg';
import sessionAtmosphere from '../Images/session_atmosphere.jpg.jpeg';
import highlightCambridge from '../Images/highlight_cambridge.jpg.jpeg';
import highlightCorporate from '../Images/highlight_corporate.jpg.jpeg';
import highlightReviews from '../Images/highlight_reviews.jpg.jpeg';
import profileScreenshot from '../Images/profile_screenshot.jpg.jpeg';

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
}

export function SectionHeader({ eyebrow, title, children, center = true }: SectionHeaderProps) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Hero() {
  return (
    <section id="why-elevra" className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="pill"><span /> Live 1-on-1 & Small Group Cohorts Available</div>
          <h1>Speak with <em>Poise.</em><br />Lead with Confidence.</h1>
          <p>Business English and spoken communication mentorship designed to help working professionals stop hesitating, command meetings, and sound effortlessly executive — in just 90 days.</p>
          <div className="hero-actions">
            <Button to="#demo">Book a Free Demo Session</Button>
            <Button to="#courses" secondary>Explore Programs</Button>
          </div>
          <div className="stats">
            <div><b>9,300+</b><span>Instagram Community</span></div>
            <div><b>160+</b><span>Cohorts Graduated</span></div>
            <div><b>98%</b><span>Speaking Confidence</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="portrait-card">
            <img
              src={heroEditorial}
              alt="Coach Kanika"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', borderRadius: '34px' }}
            />
            <div className="coach-badge"><span>CAMBRIDGE CERTIFIED</span><b>Kanika</b><small>Executive Communication Coach</small></div>
            <div className="coach-tags"><span>Corporate English</span><span>90-Day Mentorship</span><span>1-on-1 Coaching</span></div>
          </div>
          <div className="review-float"><Star fill="currentColor" size={16} /><span>“In 6 weeks, Kanika rebuilt how I articulate under pressure.”</span></div>
        </div>
      </div>
    </section>
  );
}


export function DemoVideo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="section demo-video-section">
      <SectionHeader
        eyebrow="See Elevra in Action"
        title={<>A quick look at how <em>the coaching works.</em></>}
      >
        See the teaching style, session atmosphere, and practical boardroom communication work inside Elevra.
      </SectionHeader>
      <div className="demo-video-card">
        <div
          className="demo-video-placeholder"
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Play coaching session walkthrough"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setModalOpen(true); }}
        >
          <img
            src={sessionAtmosphere}
            alt="Elevra Live Session Atmosphere"
            className="video-backdrop-img"
          />
          <div className="video-backdrop-overlay" />
          <button className="video-play" aria-label="Play session walkthrough" type="button">
            ▶
          </button>
          <div className="video-overlay-copy">
            <span>Live Session Walkthrough</span>
            <strong>See the 90-Day Fluency Accelerator in Action</strong>
            <small>70–80% active speaking · Instant micro-corrections · Real meeting simulations</small>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="video-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close walkthrough modal"
              type="button"
            >
              <X size={22} />
            </button>
            <div className="video-modal-content">
              <span className="eyebrow">Session Architecture</span>
              <h3>What Happens Inside an Elevra Session</h3>
              <p>Every 60-minute session is engineered around high-pressure speaking, not passive grammar lectures:</p>
              <div className="session-steps">
                <div className="session-step">
                  <div className="step-num">01</div>
                  <div>
                    <strong>Spontaneous Impromptu Drill (15 mins)</strong>
                    <p>Unscripted speaking prompts to completely break mother-tongue translation habits and filler words.</p>
                  </div>
                </div>
                <div className="session-step">
                  <div className="step-num">02</div>
                  <div>
                    <strong>Executive Vocabulary & Tone Refinement (20 mins)</strong>
                    <p>Upgrading casual phrases into authoritative, executive phrasing suitable for CXOs and global clients.</p>
                  </div>
                </div>
                <div className="session-step">
                  <div className="step-num">03</div>
                  <div>
                    <strong>Live Boardroom & Q&A Simulation (25 mins)</strong>
                    <p>Defending viewpoints, disagreeing diplomatically, and presenting under simulated meeting pressure.</p>
                  </div>
                </div>
              </div>
              <div className="video-modal-footer">
                <Button
                  to="#demo"
                  onClick={() => setModalOpen(false)}
                >
                  Experience It in a Free Live Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="trust">
      <div><strong>900+</strong><span>professionals trained from leading MNCs</span></div>
      <div><strong>Google · Amazon · Deloitte · Microsoft</strong><span>Learners from leading global teams</span></div>
      <div><strong>Cambridge-aligned pedagogy</strong><span>70–80% active speaking in every session</span></div>
    </section>
  );
}

export function Features() {
  return (
    <section id="features" className="section">
      <SectionHeader eyebrow="The Elevra Difference" title="What You Get With Elevra">We don’t teach you like school students. We coach you like the corporate leader you are becoming.</SectionHeader>
      <div className="feature-grid">
        {features.map(([title, desc, Icon]) => (
          <article className="feature-card" key={title}>
            <div className="icon-box"><Icon size={21} /></div>
            <h3>{title}</h3><p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BeforeAfter() {
  const before = [
    'Freeze on the spot in leadership calls when unexpectedly asked a question',
    'Translate from your native language, causing awkward pauses and fillers',
    'Re-read high-stakes client emails before daring to hit send',
    'Technical skills are strong, but spoken hesitation holds back visibility',
  ];
  const after = [
    'Sharp, calm and articulate under high-pressure questioning',
    'Think directly in English with natural rhythm and flow',
    'Draft authoritative executive emails in minutes',
    'Command respect in boardrooms, town halls and global meetings',
  ];

  return (
    <section className="section sand">
      <SectionHeader eyebrow="The Transformation" title="From Hesitation to Executive Presence">The goal isn’t perfect English. It’s calm, clear communication when the stakes are high.</SectionHeader>
      <div className="ba-grid">
        <article className="state-card before">
          <span className="state-pill"><X size={15} /> Hesitation State</span>
          <ul>{before.map(x => <li key={x}><X size={18} />{x}</li>)}</ul>
        </article>
        <div className="arrow-center"><ArrowRight /></div>
        <article className="state-card after">
          <span className="state-pill"><Check size={15} /> Elevra State</span>
          <ul>{after.map(x => <li key={x}><Check size={18} />{x}</li>)}</ul>
        </article>
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section id="journey" className="section">
      <SectionHeader eyebrow="The Transformation Blueprint" title="Your 90-Day Journey">Three systematic milestones to build instinctive corporate fluency.</SectionHeader>
      <div className="journey-grid">
        {journey.map((j, i) => (
          <article className="journey-card" key={j.month}>
            <div className="month"><span>{j.month}</span><b>0{i + 1}</b></div>
            <h3>{j.title}</h3><p>{j.sub}</p>
            <ul>{j.items.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Pricing() {
  const group = ['Live classes 4 days/week', '75% speaking time per student', 'Real-time pronunciation & sentence critique', 'Cambridge-aligned materials', 'Verified certificate'];
  const vip = ['Curriculum tailored to your job role', 'Flexible scheduling & rescheduling', 'WhatsApp review of real office emails & decks', 'Weekly fluency scorecards', 'Lifetime vault & alumni access'];

  return (
    <section id="courses" className="section sand">
      <SectionHeader eyebrow="Courses & Plans" title="Choose Your Coaching Format">Both tracks follow the same 90-day transformation arc. The difference is how closely the experience is tailored to you.</SectionHeader>
      <div className="pricing-grid">
        <article className="price-card">
          <div className="price-head"><div><span>Executive Group Cohort</span><h3>₹16,500</h3></div><Users /></div>
          <p>90 days · maximum 6 learners</p>
          <ul>{group.map(x => <li key={x}><Check />{x}</li>)}</ul>
          <Button to="#demo" secondary>Book Group Demo</Button>
        </article>
        <article className="price-card featured">
          <div className="recommended">Most Recommended</div>
          <div className="price-head"><div><span>1-on-1 Personal Coaching</span><h3>₹45,000</h3></div><Sparkles /></div>
          <p>90 days · private coaching with Kanika</p>
          <ul>{vip.map(x => <li key={x}><Check />{x}</li>)}</ul>
          <Button to="#demo">Book 1-on-1 Demo</Button>
        </article>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section id="results" className="section">
      <SectionHeader eyebrow="Student Results" title="What Senior Professionals Say">Real outcomes from boardrooms, interviews and high-stakes client conversations.</SectionHeader>
      <div className="testimonial-grid">
        {testimonials.map(([name, role, quote]) => (
          <article className="testimonial" key={name}>
            <div className="stars">★★★★★</div><p>“{quote}”</p>
            <div className="person"><div>{name.split(' ').map(x => x[0]).join('')}</div><span><b>{name}</b><small>{role}</small></span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faqs" className="section sand">
      <SectionHeader eyebrow="Clarity" title="Frequently Asked Questions">Everything you need to know about the learning experience.</SectionHeader>
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <div className={`faq ${open === i ? 'open' : ''}`} key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}><span>{q}</span><ChevronDown size={19} /></button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

const quizQuestions: Array<[string, string[]]> = [
  ['When do you feel the most hesitation?', ['Sudden questions in meetings', 'Senior-role executive tone', 'Interviews & presentations', 'Emails, reports & client pushback']],
  ['How often do you translate from your mother tongue?', ['Almost constantly', 'Only when nervous', 'I know what to say but miss the professional word', 'Rarely — I want polish']],
  ['Which learning structure fits your schedule?', ['1-on-1 VIP mentorship', 'Small executive cohort (max 6)', 'Evening/weekend batches', 'Assess me in a demo first']],
];

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const choose = (answer: string) => {
    const next = [...answers, answer];
    setAnswers(next);
    setStep(step < 2 ? step + 1 : 3);
  };

  return (
    <section className="section quiz-section">
      <div className="quiz-card">
        <div><span className="eyebrow">30-Second Speaking Quiz</span><h2>What kind of support will move you fastest?</h2><p>Answer three quick questions and get a program recommendation.</p></div>
        {step < 3 ? (
          <div className="quiz-question">
            <div className="quiz-progress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
            <small>Question {step + 1} of 3</small><h3>{quizQuestions[step][0]}</h3>
            <div className="quiz-options">{quizQuestions[step][1].map(x => <button key={x} onClick={() => choose(x)}>{x}<ArrowRight size={16} /></button>)}</div>
          </div>
        ) : (
          <div className="quiz-result">
            <Sparkles />
            <h3>{answers[2]?.includes('1-on-1') || answers[0]?.includes('Senior') ? '1-on-1 VIP Mentorship' : 'Executive Group Cohort'}</h3>
            <p>Your answers suggest this structure will give you the strongest mix of accountability, practice and flexibility.</p>
            <div><Button to="#demo">Book My Demo</Button><button className="text-btn" onClick={() => { setStep(0); setAnswers([]); }}>Retake Quiz</button></div>
          </div>
        )}
      </div>
    </section>
  );
}

export function CourseComparison() {
  return (
    <section className="section comparison-section">
      <div className="comparison">
        <SectionHeader eyebrow="Program Comparison" title="Which track is right for you?">
          Whether you learn best in collaborative cohorts or require bespoke executive focus.
        </SectionHeader>
        <div className="compare-grid">
          <div>
            <span>Choose Group</span>
            <h3>You learn best with peer energy.</h3>
            <p>Great for professionals who want structured group routines, evening batches, and collaborative meeting simulations.</p>
          </div>
          <div>
            <span>Choose 1-on-1</span>
            <h3>You need your communication tailored to your work.</h3>
            <p>Best for confidential leadership presentations, flexible calendars, and personalized pronunciation and tone coaching.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutKanika() {
  return (
    <section id="about" className="section about-grid">
      <div className="about-portrait">
        <img
          src={kanikaPortrait}
          alt="Coach Kanika"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', borderRadius: '28px' }}
        />
        <span>Cambridge Certified Coach</span>
      </div>
      <div>
        <span className="eyebrow">The Coach & Philosophy</span>
        <h2>Stop studying English. Start using it under pressure.</h2>
        <p>Elevra combines Cambridge-aligned pedagogy with practical executive communication coaching for ambitious professionals.</p>
        <p>Kanika’s approach is built around real high-stakes work scenarios: boardroom articulation, spontaneous Q&As, executive presentations, client negotiations, and concise written updates.</p>
        <p>Every session prioritizes active speaking time (70-80%), micro-corrections, and realistic roleplay simulations so progress is instantly visible when the pressure arrives.</p>
        <div className="signature">Kanika <small>English With Kanika · Founder & Lead Coach</small></div>
      </div>
    </section>
  );
}

export function OutcomesSnapshot() {
  const outcomes: Array<[string, string]> = [
    ['Meeting presence', 'Speak with composure without mentally translating or rehearsing every sentence.'],
    ['Executive tone', 'Sound concise, structured, warm, and authoritative across meetings.'],
    ['Spontaneous fluency', 'Handle unexpected questions, follow-ups, and pushback without freezing.'],
    ['Career visibility', 'Present ideas with persuasive confidence to gain leadership buy-in.'],
  ];

  return (
    <div className="outcomes-wrap sand">
      <div className="section">
        <SectionHeader eyebrow="Outcome Snapshot" title="What changes after 90 days">
          Clear, measurable transformation across your everyday professional interactions.
        </SectionHeader>
        <div className="outcomes">
          {outcomes.map(([title, desc]) => (
            <article key={title}>
              <Sparkles />
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuideBook() {
  const items = [
    'Boardroom phrases for entering, steering, and redirecting high-stakes conversations',
    'Executive email templates for leadership updates, escalations, and proposals',
    'Filler-word reset drills to permanently drop "um", "uh", and hesitation habits',
    'Vocabulary & framing techniques for constructive disagreement and pushback',
    'A practical 7-day speaking confidence reset roadmap',
  ];

  return (
    <section id="guide" className="section">
      <SectionHeader eyebrow="Free Resource" title={<>Your pocket guide to <em>executive English.</em></>}>
        A practical companion for sounding clearer, more concise, and commanding respect at work.
      </SectionHeader>
      <div className="guide-card">
        <div className="guide-cover">
          <span>elevr.a</span>
          <h2>The Executive<br />Communication Guide</h2>
          <small>English With Kanika · 45-Page Edition</small>
        </div>
        <div>
          <span className="eyebrow">Inside the guide</span>
          <h2>Small changes. Big difference.</h2>
          <ul>{items.map(x => <li key={x}><Check />{x}</li>)}</ul>
          <a
            className="btn"
            href="#demo"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('demo');
              if (el) {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }}
          >
            <Download size={17} /> Download Companion Guide
          </a>
        </div>
      </div>
    </section>
  );
}

const INITIAL_FORM_STATE = {
  fullName: '',
  profession: '',
  email: '',
  whatsappNumber: '',
  format: '1-on-1 VIP Mentorship',
  preferredSlot: 'Morning (9:00 AM – 12:00 PM)',
  primaryGoal: 'Freezing under pressure in meetings',
  company_hp: '', // Honeypot spam trap
};

export function DemoBooking() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    // Abort controller with 12s timeout to protect against network hung states
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      // Safely parse JSON or fallback to text if response is non-JSON
      let result: any = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch {
          result = null;
        }
      } else {
        const textBody = await response.text();
        if (textBody) {
          result = { message: textBody.slice(0, 200) };
        }
      }

      if (!response.ok) {
        const message =
          (result && (result.message || (result.errors && result.errors.join(' ')))) ||
          `Server responded with error (${response.status}${response.statusText ? ': ' + response.statusText : ''}). Please try again or reach out via WhatsApp.`;
        throw new Error(message);
      }

      setSent(true);
      setFormData(INITIAL_FORM_STATE);
    } catch (err: unknown) {
      let msg = 'Something went wrong. Please check your network connection or contact us directly on WhatsApp.';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          msg = 'Request timed out. Please check your internet connection or reach out on WhatsApp (+91 87002 76743).';
        } else {
          msg = err.message;
        }
      }
      setErrorMsg(msg);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSent(false);
    setErrorMsg(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const points = [
    'Live 1-on-1 on Google Meet with Coach Kanika',
    'Real-time personalised feedback on your pronunciation & tone',
    'A diagnosis of your speaking hesitation & mental translation blocks',
    'A tailored 90-day executive communication roadmap',
  ];

  return (
    <section id="demo" className="section sand">
      <SectionHeader eyebrow="Free 1-on-1 Demo" title={<>Reserve your live <em>coaching demo.</em></>}>
        30 minutes. Real feedback. No sales pressure, no boring webinars.
      </SectionHeader>
      <div className="demo-wrap">
        <div className="demo-info">
          <span className="eyebrow">What happens inside</span>
          <h2>Leave with clarity, not another sales pitch.</h2>
          {points.map((x) => (
            <div className="demo-point" key={x}>
              <Check />{x}
            </div>
          ))}
          <div className="privacy">
            <ShieldCheck /> 100% Confidential. No spam or aggressive marketing calls.
          </div>
        </div>
        {sent ? (
          <div className="success-card">
            <Sparkles />
            <h2>Demo Request Received!</h2>
            <p>
              Your demo request has been saved. Coach Kanika’s team will reach out via WhatsApp & email within 24 hours to coordinate and confirm your Google Meet appointment.
            </p>
            <button className="btn" type="button" onClick={resetForm}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form className="demo-form" onSubmit={submit}>
            {errorMsg && (
              <div className="form-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Invisible honeypot field for bot protection */}
            <input
              type="text"
              name="company_hp"
              value={formData.company_hp}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none', position: 'absolute', left: '-9999px' }}
              aria-hidden="true"
            />

            <label>
              Full Name
              <input
                required
                name="fullName"
                placeholder="Your name"
                value={formData.fullName}
                onChange={handleChange}
                maxLength={80}
                disabled={loading}
              />
            </label>

            <label>
              Profession / Role
              <input
                required
                name="profession"
                placeholder="e.g. Engineering Manager, Consultant"
                value={formData.profession}
                onChange={handleChange}
                maxLength={100}
                disabled={loading}
              />
            </label>

            <label>
              Email
              <input
                required
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
                disabled={loading}
              />
            </label>

            <label>
              WhatsApp Number
              <input
                required
                name="whatsappNumber"
                placeholder="+91 87002 76743"
                value={formData.whatsappNumber}
                onChange={handleChange}
                maxLength={25}
                disabled={loading}
              />
            </label>

            <div className="form-row">
              <label>
                Format
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="1-on-1 VIP Mentorship">1-on-1 VIP Mentorship</option>
                  <option value="Executive Group Cohort">Executive Group Cohort</option>
                </select>
              </label>
              <label>
                Preferred Slot
                <select
                  name="preferredSlot"
                  value={formData.preferredSlot}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Morning (9:00 AM – 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="Evening (6:00 PM – 9:00 PM)">Evening (6:00 PM – 9:00 PM)</option>
                  <option value="Weekend Batch">Weekend Batch</option>
                </select>
              </label>
            </div>

            <label>
              Primary Goal
              <select
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Freezing under pressure in meetings">Freezing under pressure in meetings</option>
                <option value="Executive tone and leadership presence">Executive tone and leadership presence</option>
                <option value="Client presentations & interviews">Client presentations & interviews</option>
                <option value="Concise email writing & updates">Concise email writing & updates</option>
                <option value="Overcoming mother-tongue translation">Overcoming mother-tongue translation</option>
              </select>
            </label>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Reserving Your Spot...' : 'Reserve My Demo Spot'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="section">
      <SectionHeader eyebrow="Get In Touch" title={<>Let’s make your next conversation <em>easier.</em></>}>
        Have questions about the cohorts, corporate billing, or the right format? Connect with us directly.
      </SectionHeader>
      <div className="contact-grid">
        <div>
          <span className="eyebrow">Reach Kanika & Team</span>
          <h2>Tell us what you’re working towards.</h2>
          <p>We’ll help you choose between the cohort and 1-on-1 experience, evaluate your fluency profile, and get you onboarded smoothly.</p>
          <div className="contact-info-list">
            <p><strong>Direct Helpline:</strong> Call or WhatsApp +91 87002 76743 for fast enrollment assistance.</p>
            <p><strong>Official Inquiries:</strong> Email kanika@elevra.in for institutional and corporate programs.</p>
          </div>
        </div>
        <div className="contact-card">
          <a href="tel:+918700276743">
            <Phone />
            <span>
              <small>Phone / Call</small>
              +91 87002 76743
            </span>
          </a>
          <a href="mailto:kanika@elevra.in">
            <Mail />
            <span>
              <small>Official Email</small>
              kanika@elevra.in
            </span>
          </a>
          <a href="https://wa.me/918700276743" target="_blank" rel="noreferrer">
            <MessageCircle />
            <span>
              <small>WhatsApp Direct</small>
              +91 87002 76743 (Chat with us)
            </span>
          </a>
          <a href="https://instagram.com/elevr.a" target="_blank" rel="noreferrer">
            <Instagram />
            <span>
              <small>Instagram Community</small>
              @elevr.a
            </span>
          </a>
          <Button to="#demo">Book a Free Demo</Button>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="final-cta">
      <div>
        <span className="eyebrow">Ready when you are</span>
        <h2>Your voice should match your expertise.</h2>
        <p>Book a live 1-on-1 demo and leave with a clear 90-day executive communication roadmap.</p>
        <Button to="#demo">Reserve My Demo Spot</Button>
      </div>
    </section>
  );
}

interface PageHeroProps { eyebrow: string; title: ReactNode; desc: string; }

export function PageHero({ eyebrow, title, desc }: PageHeroProps) {
  return <section className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></section>;
}
