import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Ensure Tailwind is configured and gsap is installed.
// npm i gsap
// Tailwind: https://tailwindcss.com/docs/guides/create-react-app (or your setup)

// Theme tokens (can be moved to CSS vars if preferred)
const gradientHero = "bg-gradient-to-br from-emerald-500  to-black";
const gradientCTA = "bg-gradient-to-r from-emerald-500  to-emerald-600";
const gradientCard = "bg-gradient-to-b from-neutral-900 to-black";

// Mock Data ("mook dada" as requested)
const FEATURES: { title: string; desc: string; icon: string }[] = [
  {
    title: "Prakriti Assessment",
    desc: "A quick, evidence-aligned quiz to identify your Vata, Pitta, Kapha balance.",
    icon: "🌿",
  },
  {
    title: "AI Chat Guidance",
    desc: "Ask lifestyle, diet, and routine questions. Get instant, tailored answers.",
    icon: "🤖",
  },
  {
    title: "Daily Routines (Dinacharya)",
    desc: "Personalized morning & evening routines grounded in classical Ayurveda.",
    icon: "🌅",
  },
  {
    title: "Food & Herbs",
    desc: "Dosha-friendly food lists and gentle herbal suggestions to explore.",
    icon: "🥗",
  },
];

const STEPS = [
  { id: 1, text: "Answer 8–20 simple questions" },
  { id: 2, text: "Get your dominant dosha instantly" },
  { id: 3, text: "Chat with the AI for next steps" },
  { id: 4, text: "Adopt routines & track progress" },
];

const TESTIMONIALS = [
  {
    name: "Aarav",
    quote:
      "The assessment nailed my Pitta dominance. The routines are practical and calming.",
    tag: "Designer",
  },
  {
    name: "Meera",
    quote:
      "Chatbot responses feel thoughtful and relevant. I love the food guidance!",
    tag: "Student",
  },
  {
    name: "Rahul",
    quote:
      "Subtle animations + clear UI. Took the quiz and instantly made changes.",
    tag: "Engineer",
  },
  {
    name: "Ishita",
    quote:
      "Finally an Ayurveda tool that feels modern. The green/black theme is 🔥",
    tag: "Founder",
  },
];

const FAQS = [
  {
    q: "Is this medical advice?",
    a: "No. Prakriti AI offers educational info. For medical concerns, consult a licensed professional.",
  },
  {
    q: "How accurate is the assessment?",
    a: "It follows classical heuristics plus practical patterns. Treat results as guidance, not diagnosis.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We store minimal data and never sell personal info. See our privacy policy.",
  },
  {
    q: "Does it work without logging in?",
    a: "You can explore the quiz and chatbot in demo mode. Saving results requires an account.",
  },
];



gsap.registerPlugin(ScrollTrigger);

// Utility hook: animate section on enter
const useReveal = (ref: React.RefObject<HTMLElement>, vars?: gsap.TweenVars) => {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-reveal]"),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
          ...vars,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref, vars]);
};

// Floating orbs in hero
const BackgroundOrbs: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!orbRef.current) return;
    const q = gsap.utils.selector(orbRef);
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 6, ease: "sine.inOut" } });
    tl.to(q(".orb1"), { y: -20, x: 10 }).to(q(".orb1"), { y: 0, x: 0 });
    tl.to(q(".orb2"), { y: -14, x: -12 }, 0).to(q(".orb2"), { y: 0, x: 0 });
    tl.to(q(".orb3"), { y: -18, x: 6 }, 0.5).to(q(".orb3"), { y: 0, x: 0 });
    return () => tl.kill();
  }, []);
  return (
    <div ref={orbRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="orb1 absolute -top-10 -left-10 h-56 w-56 rounded-full blur-3xl opacity-50" style={{
        background: "radial-gradient(circle at 30% 30%, #22c55e, transparent 60%)",
      }} />
      <div className="orb2 absolute top-20 -right-10 h-48 w-48 rounded-full blur-3xl opacity-40" style={{
        background: "radial-gradient(circle at 70% 70%, #84cc16, transparent 60%)",
      }} />
      <div className="orb3 absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl opacity-30" style={{
        background: "radial-gradient(circle at 50% 50%, #22c55e, transparent 60%)",
      }} />
    </div>
  );
};

// // Mock Chat modal (demo only)
// const DemoChatModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
//   const [lines] = useState([
//     { who: "bot", text: "Hi! I’m Prakriti Bot. Ready to discover your dosha?" },
//     { who: "user", text: "Yes! I feel heat and get irritated quickly." },
//     { who: "bot", text: "That may indicate Pitta dominance. Want lifestyle tips?" },
//   ]);
//   const boxRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (!open) return;
//     if (!boxRef.current) return;
//     const tl = gsap.timeline();
//     tl.fromTo(
//       boxRef.current,
//       { y: 24, autoAlpha: 0, scale: 0.98 },
//       { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out" }
//     );
//     tl.from(".chat-line", { autoAlpha: 0, y: 12, stagger: 0.15, duration: 0.4 }, "<0.05");
//     return () => tl.kill();
//   }, [open]);
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
//       <div ref={boxRef} className="w-full max-w-lg rounded-2xl border border-emerald-600/30 bg-neutral-950 text-white shadow-2xl">
//         <div className="flex items-center justify-between p-4 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 grid place-items-center rounded-full bg-emerald-500">🤖</div>
//             <h3 className="font-semibold">Prakriti Chat (Demo)</h3>
//           </div>
//           <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
//         </div>
//         <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
//           {lines.map((l, i) => (
//             <div key={i} className={`chat-line max-w-[80%] ${l.who === "user" ? "ml-auto" : ""}`}>
//               <div className={`${l.who === "user" ? "bg-emerald-600/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"} rounded-xl px-3 py-2 text-sm`}>{l.text}</div>
//             </div>
//           ))}
//           <div className="text-xs text-white/50">(This is a static preview. Hook up your real ChatBot here.)</div>
//         </div>
//         <div className="p-3 border-t border-white/10 flex gap-2">
//           <input className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-emerald-500" placeholder="Type a message…" />
//           <button className={`rounded-lg px-4 py-2 text-sm font-medium ${gradientCTA} text-black`}>Send</button>
//         </div>
//       </div>
//     </div>
//   );
// };

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-10 text-center">
    <h2 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-lime-300 to-white bg-clip-text text-transparent">
      {title}
    </h2>
    {subtitle && (
      <p data-reveal className="mt-2 text-white/70 max-w-2xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const FeatureCard: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <div data-reveal className={`rounded-2xl p-5 ${gradientCard} border border-white/10 shadow-lg hover:shadow-emerald-500/10 transition-shadow`}> 
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-1 text-white/70 text-sm">{desc}</p>
  </div>
);

const PrakritiLanding: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [openChat, setOpenChat] = useState(false);

  const handleStartAssessment = () =>{
    navigate("/home")
  }

  const handlelogin = () => {
    navigate("/signin");
  }

  // Hero entrance timeline
  useLayoutEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".nav-item", { autoAlpha: 0, y: -10, stagger: 0.06, duration: 0.4, ease: "power2.out" });
      tl.from(".hero-kicker, .hero-title, .hero-sub, .hero-cta", { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.6, ease: "power3.out" }, "<0.1");
      tl.from(".hero-card", { autoAlpha: 0, y: 24, duration: 0.6, ease: "power3.out" }, "<");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Scroll reveal hooks
  useReveal(featRef);
  useReveal(stepsRef);
  useReveal(tRef);
  useReveal(faqRef);

  // Testimonials marquee
  const marqueeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!marqueeRef.current) return;
    const width = marqueeRef.current.scrollWidth;
    const tl = gsap.to(marqueeRef.current, {
      x: -width / 2,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
    return () => tl.kill();
  }, []);

  return (
    <div className={`min-h-screen text-white ${gradientHero} relative overflow-x-clip`}> 
      {/* Hero */}
      <header ref={heroRef} className="relative">
        <BackgroundOrbs />
        <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="" className="w-14 h-12"/>
              <span className="font-semibold">Prakriti AI</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
              {['Home','Assessment','ChatBot','About'].map((n) => (
                <button key={n} className="nav-item hover:text-white/100 transition">{n}</button>
              ))}
              <button onClick={() => handlelogin()} className={`nav-item rounded-lg px-3 py-1.5 text-sm font-medium ${gradientCTA} text-black shadow`}>Login</button>
            </div>
          </div>
        </nav>

        <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="hero-kicker text-emerald-200/90 text-sm font-medium tracking-wide">Holistic • Modern • Personal</p>
              <h1 className="hero-title mt-3 text-4xl md:text-6xl font-black leading-tight">
                Discover your <span className="bg-gradient-to-r from-emerald-200 via-lime-200 to-white bg-clip-text text-transparent">Ayurvedic Constitution</span>
              </h1>
              <p className="hero-sub mt-4 text-white/80 max-w-xl">
                Take a fast, friendly assessment and chat with an AI guide trained on Ayurvedic principles. Get routines, food tips, and lifestyle insights tailored to you.
              </p>
              <div className="hero-cta mt-6 flex flex-wrap gap-3">
                <button className={`rounded-xl px-5 py-3 font-semibold ${gradientCTA} text-black shadow-lg hover:brightness-110 active:brightness-95`} onClick={handleStartAssessment}>Start Assessment</button>
                <button onClick={() => setOpenChat(true)} className="rounded-xl px-5 py-3 font-semibold border border-white/20 bg-black/30 hover:bg-black/40">💬 Chat with Prakriti Bot</button>
              </div>
            </div>
            <div className="hero-card relative">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-2xl">
                <div className="text-sm text-white/70">Assessment Preview</div>
                <div className="mt-3 space-y-3">
                  {STEPS.map((s, i) => (
                    <div key={s.id} className="rounded-2xl p-4 bg-neutral-900/60 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full grid place-items-center bg-emerald-600/30 border border-emerald-500/30 text-emerald-200">{i + 1}</div>
                        <div className="font-semibold">{s.text}</div>
                      </div>
                      <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-400 to-lime-400" style={{ width: `${(i + 1) * 20}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Features */}
      <section ref={featRef} className="relative py-16 md:py-24 border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Everything you need to begin" subtitle="Grounded in Ayurveda, elevated by design & AI." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Steps / How it works */}
      <section ref={stepsRef} className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="How Prakriti AI Works" />
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div data-reveal className="rounded-3xl p-6 border border-white/10 bg-neutral-950">
              <h3 className="text-xl font-bold">Fast Assessment</h3>
              <p className="text-white/70 mt-2">We ask focused questions (appearance, digestion, energy, mood) to estimate your dosha balance.</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80 list-disc pl-5">
                <li>Accessible language, 5–10 minutes</li>
                <li>Color-coded options: Vata (blue), Pitta (orange-red), Kapha (green)</li>
                <li>Instant result banner with tips</li>
              </ul>
            </div>
            <div data-reveal className="rounded-3xl p-6 border border-white/10 bg-neutral-950">
              <h3 className="text-xl font-bold">Guided Next Steps</h3>
              <p className="text-white/70 mt-2">Use the chatbot to explore daily routines, foods to try, and habits to balance your doshas.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl p-4 bg-black/40 border border-white/10">🥗 Food ideas</div>
                <div className="rounded-xl p-4 bg-black/40 border border-white/10">🧘 Routines</div>
                <div className="rounded-xl p-4 bg-black/40 border border-white/10">💤 Sleep tips</div>
                <div className="rounded-xl p-4 bg-black/40 border border-white/10">🏃 Movement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section ref={tRef} className="relative py-16 md:py-24 border-y border-white/10 bg-black/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="People feel calmer and clearer" />
        </div>
        <div className="relative">
          <div ref={marqueeRef} className="flex gap-4 w-[200%] px-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} data-reveal className="min-w-[320px] max-w-sm rounded-2xl p-5 bg-neutral-950 border border-white/10">
                <div className="text-white/80">“{t.quote}”</div>
                <div className="mt-3 text-sm text-white/60">— {t.name}, {t.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading title="Questions, answered" />
          <div className="space-y-3">
            {FAQS.map((f, idx) => (
              <details key={idx} data-reveal className="group rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-semibold">{f.q}</span>
                  <span className="ml-4 text-white/50 group-open:rotate-45 transition">＋</span>
                </summary>
                <p className="mt-2 text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
                <img src="/logo.png" alt="" className="w-14 h-12"/>
            <span className="text-white/80">Prakriti AI</span>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Prakriti AI. For education only. Not medical advice.</p>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Terms</a>
            <a className="hover:text-white" href="#">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default PrakritiLanding;
