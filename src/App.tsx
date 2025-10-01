import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Sun,
  Moon,
  User,
  GraduationCap,
  Code2,
  MapPin,
  Sparkles,
} from "lucide-react";
import "./index.css";
import "./App.css";


type IntroCardProps = {
  name: string;
  funFact: string;
  darkMode: boolean;
  avatarUrl: string;
};

type FunFact = { text: string };


function getRandomIndex(max: number, exclude?: number) {
  if (max <= 1) return 0;
  let idx = Math.floor(Math.random() * max);
  while (idx === exclude) {
    idx = Math.floor(Math.random() * max);
  }
  return idx;
}

function FancyTitle({ text }: { text: string }) {
  return (
    <h1 className="title">
      {text.split("").map((ch, i) => (
        <span
          className="char"
          style={{ ["--i" as any]: i } as React.CSSProperties}
          key={i}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </h1>
  );
}

function IntroCard({ name, funFact, darkMode, avatarUrl }: IntroCardProps) {
  return (
    <section className="card stack center" style={{ ["--delay" as any]: "0ms" }}>
      <div className="avatar-wrap">
        <img src={avatarUrl} alt="Profile" className="avatar" />
      </div>

      <FancyTitle text={`°❀.ೃ࿔*Hello, My name is ${name}!°❀.ೃ࿔*`} />

      {darkMode ? (
        <p className="muted funfact" key={funFact}>
          Fun fact: {funFact}
        </p>
      ) : (
        <p className="muted">Switch to dark mode to reveal my fun facts ⏾⋆.˚</p>
      )}
    </section>
  );
}

function AboutPanel() {
  return (
    <section className="card stack center" style={{ ["--delay" as any]: "120ms" }}>
      <h2 className="h2 center-row">
        <User className="icon" />
        <span>About me</span>
      </h2>

      <ul className="bullets">
        <li className="bullet">
          <GraduationCap className="icon" />
          <span>Bachelor in IT (frontend)</span>
        </li>
        <li className="bullet">
          <Code2 className="icon" />
          <span>Focus: React + TypeScript</span>
        </li>
        <li className="bullet">
          <MapPin className="icon" />
          <span>Based in Norway</span>
        </li>
        <li className="bullet">
          <Sparkles className="icon" />
          <span>Interests: UI/UX & Game development</span>
        </li>
      </ul>
    </section>
  );
}

function LinksPanel() {
  return (
    <section className="card stack center" style={{ ["--delay" as any]: "240ms" }}>
      <h2 className="h2">Find me</h2>
      <div className="links">
        <a href="mailto:hello@example.com" className="link">
          <Mail className="icon" />
          Email
        </a>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="link">
          <Github className="icon" />
          GitHub
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="link">
          <Linkedin className="icon" />
          LinkedIn
        </a>
      </div>
    </section>
  );
}


export default function App() {
  const [dark, setDark] = useState(false);
  const [facts, setFacts] = useState<FunFact[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [factsError, setFactsError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/funfacts.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load funfacts.json (${res.status})`);
        const data = (await res.json()) as { funFacts?: FunFact[] };

        if (!cancelled) {
          const list = data.funFacts ?? [];
          setFacts(
            list.length
              ? list
              : [{ text: "Add your fun facts to /public/funfacts.json 🎉" }]
          );
          setCurrentIdx(0);
          setLoadingFacts(false);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setFactsError(e instanceof Error ? e.message : "Unknown error");
          setFacts([{ text: "Could not load funfacts.json (using fallback)." }]);
          setLoadingFacts(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadingFacts || facts.length === 0) return;
    const id = setInterval(() => {
      setCurrentIdx((prev) => getRandomIndex(facts.length, prev));
    }, 2000);
    return () => clearInterval(id);
  }, [facts.length, loadingFacts]);

  const currentFact = facts[currentIdx]?.text ?? "";

  return (
    <div className="page">
      <header className="toolbar">
        <button
          className="btn"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="icon" /> : <Moon className="icon" />}
          <span>{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </header>

      <main className="container">
        <IntroCard
          name="Tara"
          funFact={
            loadingFacts
              ? "Loading fun facts…"
              : factsError
              ? `Error: ${factsError}`
              : currentFact
          }
          darkMode={dark}
          avatarUrl="/img/profilep.png"
        />
        <AboutPanel />
        <LinksPanel />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} • Random Fun Fact Viewer
      </footer>
    </div>
  );
}

