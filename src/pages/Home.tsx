import {
  Hero,
  TrustStrip,
  Features,
  BeforeAfter,
  Quiz,
  Journey,
  Pricing,
  CourseComparison,
  AboutKanika,
  Testimonials,
  OutcomesSnapshot,
  GuideBook,
  DemoVideo,
  FAQ,
  DemoBooking,
  ContactSection,
  FinalCTA
} from '../components/Sections';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Features />
      <BeforeAfter />
      <Journey />
      <Pricing />
      <CourseComparison />
      <Quiz />
      <AboutKanika />
      <Testimonials />
      <OutcomesSnapshot />
      <GuideBook />
      <DemoVideo />
      <FAQ />
      <DemoBooking />
      <ContactSection />
      <FinalCTA />
    </main>
  );
}
