import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  Car,
  ChevronDown,
  Factory,
  HardHat,
  Hash,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Target,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ParticleCanvas from "./components/ParticleCanvas";

// ─── constants ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const CAPABILITIES = [
  {
    id: "extrusion",
    title: "Extrusion",
    image: "/assets/generated/extrusion-service.dim_600x400.jpg",
    description:
      "Precision rubber extrusion for continuous profiles, tubes, weather seals, and custom cross-sections. Our state-of-the-art extrusion lines deliver dimensional consistency across high-volume production runs.",
    specs: [
      "Custom profiles",
      "Continuous lengths",
      "Tight tolerances",
      "Any rubber compound",
    ],
  },
  {
    id: "moulding",
    title: "Moulding",
    image: "/assets/generated/moulding-service.dim_600x400.jpg",
    description:
      "Compression, transfer, and injection moulding for complex geometries — gaskets, O-rings, vibration isolators, and precision components engineered to exact specifications.",
    specs: [
      "Compression moulding",
      "Transfer moulding",
      "Complex geometries",
      "OEM ready",
    ],
  },
];

const WHY_US: Array<{ icon: LucideIcon; title: string; text: string }> = [
  {
    icon: Award,
    title: "Quality Assured",
    text: "ISO-compliant processes and rigorous in-house testing ensure every component exceeds industry standards.",
  },
  {
    icon: Target,
    title: "Precision Engineering",
    text: "Advanced tooling and tight dimensional tolerances deliver parts that perform exactly as designed.",
  },
  {
    icon: Shield,
    title: "Built to Endure",
    text: "Industrial-grade compounds formulated for extreme temperature, pressure, and chemical resistance.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Solutions",
    text: "Our R&D team continuously develops new formulations and processes to solve your toughest engineering challenges.",
  },
];

const SOLUTIONS: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
  tag: string;
}> = [
  {
    icon: Car,
    title: "Automotive",
    text: "Engine seals, suspension bushings, weatherstripping, hoses, and vibration dampers for OEM and aftermarket applications.",
    tag: "High-Volume Precision",
  },
  {
    icon: Factory,
    title: "Industrial",
    text: "Custom profiles, anti-vibration mounts, conveyor components, and fluid-handling seals for heavy industry.",
    tag: "Custom & Scalable",
  },
  {
    icon: HardHat,
    title: "Construction",
    text: "Waterproofing strips, expansion joint seals, rubber bearings, vibration pads, and weather seals engineered for structural integrity in demanding construction environments.",
    tag: "Built to Last",
  },
];

const STATS = [
  { value: "26+", label: "Years of Manufacturing Experience" },
  { value: "500+", label: "Product Variants Delivered" },
  { value: "99%", label: "On-Time Delivery Rate" },
  { value: "24/7", label: "Technical Support Available" },
];

const TEAM = [
  {
    name: "Kalpana Gandhi",
    role: "Business Owner",
    initials: "KG",
  },
  {
    name: "Bijal Gandhi",
    role: "Supervisor",
    initials: "BG",
  },
];

// ─── section fade hook ───────────────────────────────────────────────────────

function useSectionFade(ref: React.RefObject<Element | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("in-view"), delay);
        }
      },
      { threshold: 0.1, rootMargin: "-60px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}

// ─── SVG icons for capabilities ──────────────────────────────────────────────

function ExtrusionIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-neon"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="18"
        width="24"
        height="12"
        rx="2"
        stroke="#b7ff3c"
        strokeWidth="1.5"
      />
      <path
        d="M28 20 L44 24 L28 28 Z"
        stroke="#b7ff3c"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(183,255,60,0.08)"
      />
      <line
        x1="34"
        y1="24"
        x2="44"
        y2="24"
        stroke="#b7ff3c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="4" y="20" width="4" height="8" fill="rgba(183,255,60,0.15)" />
    </svg>
  );
}

function MouldingIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon-neon"
      aria-hidden="true"
    >
      <rect
        x="6"
        y="6"
        width="36"
        height="16"
        rx="2"
        stroke="#b7ff3c"
        strokeWidth="1.5"
      />
      <rect
        x="6"
        y="26"
        width="36"
        height="16"
        rx="2"
        stroke="#b7ff3c"
        strokeWidth="1.5"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="8"
        ry="4"
        fill="rgba(183,255,60,0.18)"
        stroke="#b7ff3c"
        strokeWidth="1"
      />
      <line
        x1="24"
        y1="6"
        x2="24"
        y2="26"
        stroke="#b7ff3c"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
    </svg>
  );
}

// ─── Card sub-components (each owns its own ref + fade hook) ─────────────────

function CapabilityCard({
  cap,
  delay,
}: {
  cap: (typeof CAPABILITIES)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionFade(ref, delay);
  return (
    <div
      ref={ref}
      className="section-reveal card-neon rounded-2xl overflow-hidden group"
      data-ocid="services.card"
    >
      <div className="relative h-52 sm:h-64 overflow-hidden">
        <img
          src={cap.image}
          alt={cap.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,7,5,0.1) 0%, rgba(5,7,5,0.6) 100%)",
          }}
        />
      </div>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-5">
          {cap.id === "extrusion" ? <ExtrusionIcon /> : <MouldingIcon />}
          <h3 className="font-display font-extrabold text-3xl uppercase tracking-tight text-neon">
            {cap.title}
          </h3>
        </div>
        <p className="text-foreground/70 leading-relaxed mb-6 text-sm sm:text-base">
          {cap.description}
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {cap.specs.map((spec) => (
            <li
              key={spec}
              className="flex items-center gap-2 text-xs font-semibold text-foreground/55 uppercase tracking-wide"
            >
              <Zap size={10} className="icon-neon flex-shrink-0" />
              {spec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function WhyUsCard({
  item,
  delay,
}: {
  item: (typeof WHY_US)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionFade(ref, delay);
  const Icon = item.icon;
  return (
    <div
      ref={ref}
      className="section-reveal card-neon rounded-2xl p-8 group text-center"
      data-ocid="whyus.card"
    >
      <div className="flex justify-center mb-5">
        <div
          className="p-3 rounded-xl"
          style={{
            background: "rgba(183,255,60,0.07)",
            border: "1px solid rgba(183,255,60,0.2)",
          }}
        >
          <Icon size={28} className="icon-neon" />
        </div>
      </div>
      <h3 className="font-display font-bold text-lg uppercase tracking-wide text-foreground mb-3 group-hover:text-neon transition-colors duration-300">
        {item.title}
      </h3>
      <p className="text-foreground/60 text-sm leading-relaxed">{item.text}</p>
    </div>
  );
}

function StatCard({
  stat,
  delay,
}: {
  stat: (typeof STATS)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionFade(ref, delay);
  return (
    <div
      ref={ref}
      className="section-reveal card-neon rounded-2xl p-7 text-center animate-border-glow"
      data-ocid="about.card"
    >
      <p className="font-display font-extrabold text-4xl text-neon mb-2">
        {stat.value}
      </p>
      <p className="text-foreground/55 text-xs uppercase tracking-widest font-semibold">
        {stat.label}
      </p>
    </div>
  );
}

function SolutionCard({
  sol,
  delay,
}: {
  sol: (typeof SOLUTIONS)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionFade(ref, delay);
  const Icon = sol.icon;
  return (
    <div
      ref={ref}
      className="section-reveal card-neon rounded-2xl p-8 group"
      data-ocid="solutions.card"
    >
      <div className="flex items-start gap-4 mb-5">
        <div
          className="p-3 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(183,255,60,0.07)",
            border: "1px solid rgba(183,255,60,0.2)",
          }}
        >
          <Icon size={26} className="icon-neon" />
        </div>
        <div>
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
            style={{
              background: "rgba(183,255,60,0.1)",
              color: "#b7ff3c",
              border: "1px solid rgba(183,255,60,0.25)",
            }}
          >
            {sol.tag}
          </span>
          <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-foreground group-hover:text-neon transition-colors duration-300">
            {sol.title}
          </h3>
        </div>
      </div>
      <p className="text-foreground/60 text-sm leading-relaxed">{sol.text}</p>
    </div>
  );
}

function TeamMemberCard({
  member,
  delay,
}: {
  member: (typeof TEAM)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionFade(ref, delay);
  return (
    <div
      ref={ref}
      className="section-reveal card-neon rounded-2xl p-10 group text-center"
      data-ocid="team.card"
    >
      {/* Initials avatar */}
      <div className="flex justify-center mb-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center select-none"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(183,255,60,0.15), rgba(183,255,60,0.04))",
            border: "1.5px solid rgba(183,255,60,0.45)",
            boxShadow:
              "0 0 20px rgba(183,255,60,0.18), inset 0 0 20px rgba(183,255,60,0.06)",
          }}
        >
          <span
            className="font-display font-extrabold text-3xl tracking-tight"
            style={{
              color: "#b7ff3c",
              textShadow:
                "0 0 12px rgba(183,255,60,0.7), 0 0 30px rgba(183,255,60,0.35)",
            }}
          >
            {member.initials}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-foreground mb-1 group-hover:text-neon transition-colors duration-300">
        {member.name}
      </h3>

      {/* Thin neon rule under name */}
      <div className="divider-neon w-16 mx-auto my-4" />

      {/* Role badge */}
      <div className="flex items-center justify-center gap-2">
        <Briefcase size={13} className="icon-neon flex-shrink-0" />
        <span
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{
            color: "#b7ff3c",
            textShadow: "0 0 8px rgba(183,255,60,0.5)",
          }}
        >
          {member.role}
        </span>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-blur" : "bg-transparent"
      }`}
      data-ocid="navbar.panel"
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className="text-neon-sm font-display font-extrabold text-xl md:text-2xl tracking-widest uppercase select-none"
          data-ocid="navbar.link"
        >
          Trinity Polymer
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`text-sm font-semibold uppercase tracking-widest transition-all duration-200 ${
                  currentPath === link.href
                    ? "text-neon-sm"
                    : "text-foreground/60 hover:text-foreground/90"
                }`}
                data-ocid="navbar.link"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="tel:9004300818"
              className="btn-neon-outline text-xs py-2 px-5"
              data-ocid="navbar.primary_button"
            >
              <Phone size={13} />
              Call Now
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden p-2 text-foreground/80 hover:text-primary"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          data-ocid="navbar.toggle"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="md:hidden navbar-blur border-t border-border/30 px-5 pt-4 pb-6 flex flex-col gap-4"
          data-ocid="navbar.panel"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-left text-base font-semibold uppercase tracking-widest py-1 ${
                currentPath === link.href
                  ? "text-neon-sm"
                  : "text-foreground/75 hover:text-neon-sm"
              }`}
              data-ocid="navbar.link"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:9004300818"
            className="btn-neon-outline mt-2 w-fit text-xs"
            data-ocid="navbar.primary_button"
          >
            <Phone size={13} />
            9004300818
          </a>
        </motion.div>
      )}
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-20 pb-16 overflow-hidden"
      data-ocid="hero.section"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 30%, rgba(5,7,5,0.65) 100%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-foreground/50 mb-6"
        >
          Precision Engineered Rubber &amp; Polymers
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35 }}
          className="font-display font-extrabold uppercase tracking-[-0.02em] text-neon-hero leading-none mb-6 animate-pulse-glow"
          style={{ fontSize: "clamp(3.2rem, 10vw, 9rem)" }}
        >
          Trinity
          <br />
          Polymer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg sm:text-xl text-foreground/65 font-medium tracking-wide mb-10 max-w-xl mx-auto"
        >
          Specialists in&nbsp;
          <span className="text-neon-sm font-semibold">Extrusion</span>
          &nbsp;&amp;&nbsp;
          <span className="text-neon-sm font-semibold">Moulding</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/services" })}
            className="btn-neon-outline"
            data-ocid="hero.primary_button"
          >
            Explore Services <ArrowRight size={14} />
          </button>
          <a
            href="tel:9004300818"
            className="btn-neon-solid"
            data-ocid="hero.secondary_button"
          >
            <Phone size={14} />
            9004300818
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-2 text-foreground/30 cursor-pointer select-none"
          onClick={() => navigate({ to: "/services" })}
        >
          <span className="text-xs tracking-widest uppercase">Explore</span>
          <ChevronDown size={18} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Capabilities / Services ─────────────────────────────────────────────────

function Capabilities() {
  const headingRef = useRef<HTMLDivElement>(null);
  useSectionFade(headingRef);

  return (
    <section
      id="services"
      className="relative py-28 md:py-36 px-5 sm:px-8"
      data-ocid="services.section"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="section-reveal text-center mb-16">
          <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
            What We Do
          </p>
          <h2
            className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground"
            style={{ textShadow: "0 0 40px rgba(183,255,60,0.08)" }}
          >
            Our <span className="text-neon">Capabilities</span>
          </h2>
          <div className="divider-neon w-24 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.id} cap={cap} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ───────────────────────────────────────────────────────────

function WhyUs() {
  const headingRef = useRef<HTMLDivElement>(null);
  useSectionFade(headingRef);

  return (
    <section
      className="relative py-28 md:py-36 px-5 sm:px-8"
      data-ocid="whyus.section"
    >
      <div className="divider-neon max-w-7xl mx-auto mb-28" />
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="section-reveal text-center mb-16">
          <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
            The Trinity Difference
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
            Why <span className="text-neon">Choose Us</span>
          </h2>
          <div className="divider-neon w-24 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item, i) => (
            <WhyUsCard key={item.title} item={item} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useSectionFade(textRef);

  return (
    <section
      id="about"
      className="relative py-28 md:py-36 px-5 sm:px-8"
      data-ocid="about.section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={textRef} className="section-reveal">
            <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
              Our Story
            </p>
            <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl text-foreground mb-6">
              About <span className="text-neon">Trinity</span>
            </h2>
            <div className="divider-neon w-20 mb-8" />
            <p className="text-foreground/70 text-base sm:text-lg leading-relaxed mb-5">
              Trinity Polymer is a dedicated rubber manufacturing company
              specialising in precision extrusion and moulding. Founded on a
              commitment to engineering excellence, we produce custom rubber
              components that meet the most demanding specifications across
              automotive, industrial, and construction sectors.
            </p>
            <p className="text-foreground/60 text-sm sm:text-base leading-relaxed mb-8">
              Our facility combines advanced processing equipment with rigorous
              quality control — enabling us to deliver consistent,
              high-performance products at competitive lead times. From
              prototype to production, we partner with our clients at every
              stage of the product lifecycle.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/contact" })}
              className="btn-neon-outline"
              data-ocid="about.primary_button"
            >
              Get In Touch <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team ────────────────────────────────────────────────────────────────────

function Team() {
  const headingRef = useRef<HTMLDivElement>(null);
  useSectionFade(headingRef);

  return (
    <section
      id="team"
      className="relative py-24 md:py-32 px-5 sm:px-8"
      data-ocid="team.section"
    >
      <div className="divider-neon max-w-7xl mx-auto mb-24" />
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="section-reveal text-center mb-14">
          <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
            The People Behind Trinity
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
            Our <span className="text-neon">Leadership</span>
          </h2>
          <div className="divider-neon w-24 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {TEAM.map((member, i) => (
            <TeamMemberCard key={member.name} member={member} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solutions ───────────────────────────────────────────────────────────────

function Solutions() {
  const headingRef = useRef<HTMLDivElement>(null);
  useSectionFade(headingRef);

  return (
    <section
      className="relative py-28 md:py-36 px-5 sm:px-8"
      data-ocid="solutions.section"
    >
      <div className="divider-neon max-w-7xl mx-auto mb-28" />
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="section-reveal text-center mb-16">
          <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
            Industries We Serve
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
            Our <span className="text-neon">Solutions</span>
          </h2>
          <div className="divider-neon w-24 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((sol, i) => (
            <SolutionCard key={sol.title} sol={sol} delay={i * 110} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  const headingRef = useRef<HTMLDivElement>(null);
  useSectionFade(headingRef);

  const iconBox = {
    background: "rgba(183,255,60,0.07)",
    border: "1px solid rgba(183,255,60,0.2)",
  };

  return (
    <section
      id="contact"
      className="relative py-28 md:py-36 px-5 sm:px-8"
      data-ocid="contact.section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div ref={headingRef} className="section-reveal text-center mb-16">
          <p className="text-xs font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
            Let&rsquo;s Work Together
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
            Get <span className="text-neon">In Touch</span>
          </h2>
          <div className="divider-neon w-24 mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ── Phone hero — full width ───────────────────────────────── */}
          <div
            className="sm:col-span-2 lg:col-span-4 card-neon rounded-2xl p-8 sm:p-12 text-center"
            data-ocid="contact.card"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/50 mb-4">
              Call Us Directly
            </p>
            <a
              href="tel:9004300818"
              className="font-display font-extrabold text-neon-hero leading-none tracking-tight block mb-3 hover:scale-105 transition-transform duration-300"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
              data-ocid="contact.link"
            >
              9004300818
            </a>
            <p className="text-foreground/50 text-sm tracking-wide">
              Monday &ndash; Saturday &middot; 9:00 AM &ndash; 7:00 PM IST
            </p>
          </div>

          {/* ── Email ──────────────────────────────────────────────────── */}
          <div
            className="card-neon rounded-2xl p-7 flex items-start gap-5"
            data-ocid="contact.card"
          >
            <div className="p-4 rounded-xl flex-shrink-0" style={iconBox}>
              <Mail size={24} className="icon-neon" />
            </div>
            <div className="min-w-0">
              <p className="text-foreground/45 text-xs uppercase tracking-widest font-bold mb-1">
                Email
              </p>
              <a
                href="mailto:kalpanagandhi8@rediffmail.com"
                className="text-foreground/85 font-semibold text-sm break-all hover:text-neon-sm transition-colors"
                data-ocid="contact.link"
              >
                kalpanagandhi8@rediffmail.com
              </a>
            </div>
          </div>

          {/* ── Address ────────────────────────────────────────────────── */}
          <div
            className="card-neon rounded-2xl p-7 flex items-start gap-5"
            data-ocid="contact.card"
          >
            <div className="p-4 rounded-xl flex-shrink-0" style={iconBox}>
              <MapPin size={24} className="icon-neon" />
            </div>
            <div>
              <p className="text-foreground/45 text-xs uppercase tracking-widest font-bold mb-1">
                Address
              </p>
              <p className="text-foreground/85 font-semibold text-sm leading-snug">
                Ground Floor, B/1 Parshva Labh,
                <br />
                Diwanman, Dongri Road,
                <br />
                Vasai Virar
              </p>
              <p className="text-foreground/50 text-xs mt-1.5 font-medium">
                Maharashtra &ndash; 27
              </p>
            </div>
          </div>

          {/* ── Phone ──────────────────────────────────────────────────── */}
          <div
            className="card-neon rounded-2xl p-7 flex items-start gap-5"
            data-ocid="contact.card"
          >
            <div className="p-4 rounded-xl flex-shrink-0" style={iconBox}>
              <Phone size={24} className="icon-neon" />
            </div>
            <div>
              <p className="text-foreground/45 text-xs uppercase tracking-widest font-bold mb-1">
                Phone
              </p>
              <a
                href="tel:9004300818"
                className="text-foreground/85 font-semibold text-sm hover:text-neon-sm transition-colors"
                data-ocid="contact.link"
              >
                +91 9004300818
              </a>
            </div>
          </div>

          {/* ── GSTIN ──────────────────────────────────────────────────── */}
          <div
            className="card-neon rounded-2xl p-7 flex items-start gap-5"
            data-ocid="contact.card"
          >
            <div className="p-4 rounded-xl flex-shrink-0" style={iconBox}>
              <Hash size={24} className="icon-neon" />
            </div>
            <div>
              <p className="text-foreground/45 text-xs uppercase tracking-widest font-bold mb-1">
                GSTIN
              </p>
              <p
                className="font-semibold text-sm tracking-wider"
                style={{
                  color: "#b7ff3c",
                  textShadow: "0 0 8px rgba(183,255,60,0.4)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                27BCMPG2881A1ZR
              </p>
              <p className="text-foreground/50 text-xs mt-1.5 font-medium">
                State: Maharashtra &ndash; 27
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="relative py-10 px-5 sm:px-8 border-t border-border/30"
      data-ocid="footer.section"
    >
      <div className="divider-neon max-w-7xl mx-auto mb-10" />
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div>
          <p className="font-display font-extrabold text-lg uppercase tracking-widest text-neon-sm mb-1">
            Trinity Polymer
          </p>
          <p className="text-foreground/40 text-xs">
            &copy; {year} Trinity Polymer. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1.5">
          <p className="text-foreground/35 text-xs">
            Specialists in Extrusion &amp; Moulding
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-foreground/40 hover:text-primary/80 transition-colors duration-200 group"
            data-ocid="footer.link"
          >
            <span>Built with</span>
            <span className="text-red-400 group-hover:text-red-300">❤️</span>
            <span>by</span>
            <span className="font-bold text-foreground/55 group-hover:text-neon-sm transition-colors duration-200">
              Caffeine AI
            </span>
            <span className="text-foreground/30">
              — Create your stunning website at caffeine.build
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Page components ─────────────────────────────────────────────────────────

function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}

function ServicesPage() {
  return (
    <main>
      <Capabilities />
      <WhyUs />
      <Solutions />
    </main>
  );
}

function AboutPage() {
  return (
    <main>
      <About />
      <Team />
    </main>
  );
}

function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}

// ─── Root layout ─────────────────────────────────────────────────────────────

function RootLayout() {
  return (
    <div
      className="relative min-h-screen bg-background"
      style={{ isolation: "isolate" }}
    >
      {/* Line-grid background layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(183,255,60,0.045) 1px, transparent 1px), linear-gradient(to right, rgba(183,255,60,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Interactive particle canvas — lines only, mouse-glow reactive */}
      <ParticleCanvas />

      {/* Page content — above canvas */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

// ─── Router ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  aboutRoute,
  contactRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
