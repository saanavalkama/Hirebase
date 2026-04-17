import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function useReveal(delay = 500) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#18181f] text-stone-200">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#18181f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            <span className="text-teal-400">Hire</span>base
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <a href="#features" className="hover:text-stone-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-stone-100 transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-stone-400 hover:text-stone-100 hover:bg-white/[0.06]">
              Log in
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-5">
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(20,184,166,0.15),transparent)]" />

        <Reveal delay={0}>
          <span className="inline-flex items-center gap-2 bg-teal-950/60 text-teal-400 text-xs font-medium px-4 py-1.5 rounded-full border border-teal-800/50 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            GitHub-driven hiring
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-3xl leading-[1.1]">
            Connect through{" "}
            <span className="text-teal-400">real code</span>,
            not claims
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 text-lg md:text-xl text-stone-400 max-w-xl leading-relaxed">
            Hirebase connects engineers with companies through real GitHub data.
            No inflated CVs, no guesswork — just actual commits and honest signals.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-teal-500/20">
              Find Talent
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-medium border-white/10 text-stone-300 hover:bg-white/[0.06] bg-transparent"
            >
              Find Jobs
            </Button>
          </div>
          <p className="mt-4 text-sm text-stone-500">Free to get started · No credit card required</p>
        </Reveal>
      </section>

      {/* Stats bar */}
      <div className="border-y border-white/[0.06] bg-white/[0.03] py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-white/[0.06] text-center">
          {[
            { stat: "24mo", label: "of commit history analyzed" },
            { stat: "5 signals", label: "per candidate profile" },
            { stat: "2-sided", label: "mutual matching" },
          ].map(({ stat, label }, i) => (
            <Reveal key={stat} delay={i * 100}>
              <div className="px-6 flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white tracking-tight">{stat}</span>
                <span className="text-sm text-stone-500">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-14">
              <p className="text-teal-400 text-sm font-medium mb-2">How it works</p>
              <h2 className="text-3xl font-semibold text-white tracking-tight">From GitHub to offer in four steps</h2>
              <p className="mt-3 text-stone-400">A hiring flow built around real signals, not self-reported skills.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Connect GitHub",
                desc: "Engineers connect their GitHub account. We analyze commits, PRs, languages, and repo quality.",
              },
              {
                step: "02",
                title: "Smart matching",
                desc: "Our algorithm scores fit based on tech stack, seniority, salary, and soft skills.",
              },
              {
                step: "03",
                title: "Get hired",
                desc: "Full profiles unlock on a match. Move fast with AI summaries and a built-in hiring pipeline.",
              },
            ].map(({ step, title, desc }, i) => (
              <Reveal key={step} delay={i * 120}>
                <div className="flex flex-col gap-4">
                  <span className="text-4xl font-bold text-white/10 tracking-tighter">{step}</span>
                  <h3 className="font-semibold text-stone-100 text-base">{title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/[0.06] bg-white/[0.02] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="mb-14">
              <p className="text-teal-400 text-sm font-medium mb-2">Features</p>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Everything you need to hire or get hired</h2>
              <p className="mt-3 text-stone-400">Built for engineers and the people who hire them.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "GitHub analysis",
                desc: "Commit frequency, PR quality, language distribution, repo health scores.",
              },
              {
                title: "Hiring pipeline",
                desc: "Kanban board per job posting. Move candidates through stages in real time.",
              },
              {
                title: "AI summaries",
                desc: "Plain English candidate summaries generated from GitHub data for faster screening.",
              },
              {
                title: "Mutual matching",
                desc: "Full profiles unlock only when both sides express interest. No noise.",
              },
            ].map(({ title, desc }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="bg-white/[0.04] rounded-2xl border border-white/[0.07] p-7 flex flex-col gap-3 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                  <h3 className="font-semibold text-stone-100 text-base">{title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(20,184,166,0.12),transparent)]" />
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mx-auto">
            Ready to hire differently?
          </h2>
          <p className="mt-4 text-stone-400 mx-auto">
            Join engineers and companies who believe real code speaks louder than keywords.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-teal-500/20">
              I'm hiring →
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-medium border-white/10 text-stone-300 hover:bg-white/[0.06] bg-transparent"
            >
              I'm looking for work →
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <span>
            <span className="text-teal-400 font-medium">Hire</span>base
          </span>
          <span>© {new Date().getFullYear()} Hirebase. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
