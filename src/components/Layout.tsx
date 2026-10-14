import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUp, Instagram, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  to: string;
  secondary?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function Button({ children, to, secondary = false, onClick }: ButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    if (to.startsWith('#')) {
      e.preventDefault();
      const id = to.substring(1);
      const element = document.getElementById(id);
      if (element) {
        const navOffset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      className={`btn ${secondary ? 'btn-secondary' : ''}`}
      href={to}
      onClick={handleClick}
    >
      {children}
      <ArrowRight size={17} />
    </a>
  );
}

export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      className="logo"
      href="#why-elevra"
      onClick={(e) => {
        e.preventDefault();
        if (onNavigate) onNavigate();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <strong>elevr.a</strong>
      <span>English With Kanika</span>
    </a>
  );
}

export const NAV_LINKS = [
  { label: 'Why Elevra', id: 'why-elevra' },
  { label: 'What You Get', id: 'features' },
  { label: '90-Day Journey', id: 'journey' },
  { label: 'Courses & Plans', id: 'courses' },
  { label: 'About Coach', id: 'about' },
  { label: 'Student Results', id: 'results' },
  { label: 'Guide Book', id: 'guide' },
  { label: 'FAQs', id: 'faqs' },
  { label: 'Contact', id: 'contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('why-elevra');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);

      const headerOffset = 130;
      let currentActive = NAV_LINKS[0].id;

      for (const item of NAV_LINKS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            currentActive = item.id;
          }
        }
      }

      // If close to bottom of page, highlight last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
        currentActive = NAV_LINKS[NAV_LINKS.length - 1].id;
      }

      setActiveSection(currentActive);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-inner">
          <Logo onNavigate={() => setActiveSection('why-elevra')} />
          <nav className={open ? 'mobile-open' : ''}>
            {NAV_LINKS.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
              >
                {label}
              </a>
            ))}
            <Button to="#demo" onClick={() => setOpen(false)}>Book a Free Demo</Button>
          </nav>
          <button
            className="menu-btn"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export function Footer() {
  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Logo />
          <p className="footer-copy">Turning hesitation into confidence for ambitious corporate professionals.</p>
          <div className="footer-quote">“My superpower? Turning hesitation into confidence.”</div>
          <div className="footer-direct-contact">
            <div className="footer-contact-item">
              <Phone size={15} />
              <span>Call / WhatsApp: <a href="tel:+918700276743">+91 87002 76743</a></span>
            </div>
            <div className="footer-contact-item">
              <Mail size={15} />
              <span>Official Email: <a href="mailto:kanika@elevra.in">kanika@elevra.in</a></span>
            </div>
          </div>
        </div>
        <div>
          <h4>Explore Sections</h4>
          {NAV_LINKS.map(({ label, id }) => (
            <a key={id} href={`#${id}`} onClick={(e) => scrollTo(id, e)}>
              {label}
            </a>
          ))}
          <a href="#demo" onClick={(e) => scrollTo('demo', e)}>Book Free Demo</a>
        </div>
        <div>
          <h4>Connect & Support</h4>
          <a href="tel:+918700276743"><Phone size={16} /> +91 87002 76743</a>
          <a href="mailto:kanika@elevra.in"><Mail size={16} /> kanika@elevra.in</a>
          <a href="https://wa.me/918700276743" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp: +91 87002 76743</a>
          <a href="https://instagram.com/elevr.a" target="_blank" rel="noreferrer"><Instagram size={16} /> @elevr.a</a>
          <div className="footer-support-note">
            <small>Mon – Sat: 9:00 AM – 8:00 PM IST · Quick turnaround on WhatsApp & Email</small>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Elevra (English with Kanika). All Rights Reserved.</span>
        <span>Email: <a href="mailto:kanika@elevra.in">kanika@elevra.in</a> | Phone: <a href="tel:+918700276743">+91 87002 76743</a></span>
        <span>Built for confident communication.</span>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <div className="floating-actions">
        {showScrollTop && (
          <button
            className="scroll-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
        <a
          className="whatsapp"
          href="https://wa.me/918700276743"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp with Coach Kanika"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={22} />
          <span className="whatsapp-tooltip">Chat with us</span>
        </a>
      </div>
    </>
  );
}

