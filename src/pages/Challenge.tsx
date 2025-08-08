import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WanderingGirl, { type Dims } from "@/components/challenge/WanderingGirl";
import { countEmojiTokens } from "@/utils/emoji";
import portraitHero from "@/assets/portrait-hero.jpg";

// Main constants
const TARGET_NORM = { x: 0.5, y: 0.28 };
const commonEmojis = [
  "🔴","🔵","🟢","⚫","⚪","❤","💙","💚","💛","💜","🌟","✨","👑","🔥","🎯","😎","😂","🤡","🥳"
];

// Simulation formula (as confirmed)
function simulateTrial(emoji: string, stage: { width: number; height: number }) {
  const tokens = countEmojiTokens(emoji || "");
  const maxTravel = 120 + 30 * tokens; // px

  const target = { x: TARGET_NORM.x * stage.width, y: TARGET_NORM.y * stage.height };
  // random start anywhere in stage
  const start = { x: Math.random() * stage.width, y: Math.random() * stage.height };
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const distToTarget = Math.hypot(dx, dy);
  const travel = Math.min(maxTravel, distToTarget);
  const ux = dx / (distToTarget || 1);
  const uy = dy / (distToTarget || 1);
  const landing = { x: start.x + ux * travel, y: start.y + uy * travel };
  const accuracy = Math.hypot(target.x - landing.x, target.y - landing.y);
  const efficiency = travel / Math.max(1, tokens);

  return { emoji, tokens, travel, accuracy, efficiency, start, landing };
}

export type Trial = ReturnType<typeof simulateTrial>;

type Phase = "intro" | "trials" | "summary";

const Challenge = () => {
  // SEO
  useEffect(() => {
    document.title = "Emoji Challenge – Token Distance & Accuracy";
    const ensureMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", name);
        document.head.appendChild(m);
      }
      m.setAttribute("content", content);
    };
    ensureMeta("description", "Play the Emoji Challenge: 3 trials to test token-based distance, accuracy and efficiency.");
    ensureMeta("robots", "index,follow");
    // canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stage, setStage] = useState<Dims>({ width: 520, height: 520 });

  const [trialIndex, setTrialIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState("🔴");
  const [trials, setTrials] = useState<Trial[]>([]);
  const [busy, setBusy] = useState(false);

  const startTrials = useCallback((d: Dims) => {
    setStage(d.width && d.height ? d : { width: 520, height: 520 });
    setPhase("trials");
  }, []);

  const onTry = useCallback(() => {
    if (busy) return;
    setBusy(true);
    const result = simulateTrial(selectedEmoji, stage);
    // exact 1s processing pause per requirement
    setTimeout(() => {
      setTrials((prev) => [...prev, result]);
      if (trialIndex >= 2) {
        setPhase("summary");
      } else {
        setTrialIndex((i) => i + 1);
      }
      setBusy(false);
    }, 1000);
  }, [busy, selectedEmoji, stage, trialIndex]);

  const best = useMemo(() => {
    if (!trials.length) return null;
    const sorted = [...trials].sort((a, b) => {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy; // lower better
      return b.efficiency - a.efficiency; // higher better
    });
    return sorted[0];
  }, [trials]);

  const reset = () => {
    setTrials([]);
    setTrialIndex(0);
    setSelectedEmoji("🔴");
    setPhase("intro");
  };

  return (
    <main className="min-h-screen py-8">
      <section className="container space-y-6">
        <header className="text-center">
          <div className="w-full h-40 rounded-md shadow bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" aria-hidden />
          <h1 className="text-4xl font-bold mt-4">Emoji Challenge</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Three emoji trials. Token-driven distance and accuracy. Aim for the target between the eyebrows.</p>
        </header>

        {/* Intro: show wandering once */}
        {phase === "intro" && (
          <div className="space-y-4 animate-enter">
            <WanderingGirl src={portraitHero} visible wanderMs={4200} onEnd={startTrials} />
            <p className="text-center text-sm text-muted-foreground">Watch once, then the character hides. Trials continue without showing her.</p>
          </div>
        )}

        {/* Trials */}
        {phase === "trials" && (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 animate-enter">
            <aside className="space-y-4">
              <Card className="p-4">
                <div className="text-sm font-semibold">Trial {trialIndex + 1} of 3</div>
                <div className="mt-2 text-sm">Selected: <span className="text-lg" aria-hidden>{selectedEmoji}</span></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {commonEmojis.map((e) => (
                    <button
                      key={e}
                      onClick={() => setSelectedEmoji(e)}
                      className={"rounded-md px-3 py-2 border hover-scale " + (selectedEmoji === e ? "bg-secondary" : "bg-background")}
                      aria-label={`Select emoji ${e}`}
                    >
                      <span className="text-xl" aria-hidden>{e}</span>
                    </button>
                  ))}
                </div>
                <Button className="mt-4 w-full" onClick={onTry} disabled={busy}>{busy ? "Processing…" : "Try Emoji"}</Button>
                <div className="mt-3 text-xs text-muted-foreground">Token formula: distance = 120 + 30 × tokens; best = lowest accuracy, tie‑break higher efficiency.</div>
              </Card>
            </aside>

            <div>
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Your Trials</h2>
                {trials.length === 0 && <p className="text-muted-foreground">No trials yet — pick an emoji and press Try.</p>}
                {trials.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="py-2 pr-2">#</th>
                          <th className="py-2 pr-2">Emoji</th>
                          <th className="py-2 pr-2">Tokens</th>
                          <th className="py-2 pr-2">Travel (px)</th>
                          <th className="py-2 pr-2">Accuracy (px)</th>
                          <th className="py-2 pr-2">Efficiency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trials.map((t, i) => (
                          <tr key={i} className={best === t ? "bg-secondary/50" : undefined}>
                            <td className="py-2 pr-2">{i + 1}</td>
                            <td className="py-2 pr-2 text-lg" aria-hidden>{t.emoji}</td>
                            <td className="py-2 pr-2">{t.tokens}</td>
                            <td className="py-2 pr-2">{t.travel.toFixed(1)}</td>
                            <td className="py-2 pr-2">{t.accuracy.toFixed(1)}</td>
                            <td className="py-2 pr-2">{t.efficiency.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Summary */}
        {phase === "summary" && (
          <div className="animate-fade-in space-y-4">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-3">Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-2 pr-2">Trial</th>
                      <th className="py-2 pr-2">Emoji</th>
                      <th className="py-2 pr-2">Tokens</th>
                      <th className="py-2 pr-2">Travel (px)</th>
                      <th className="py-2 pr-2">Accuracy (px)</th>
                      <th className="py-2 pr-2">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trials.map((t, i) => (
                      <tr key={i} className={best === t ? "bg-secondary/50" : undefined}>
                        <td className="py-2 pr-2">{i + 1}</td>
                        <td className="py-2 pr-2 text-lg" aria-hidden>{t.emoji}</td>
                        <td className="py-2 pr-2">{t.tokens}</td>
                        <td className="py-2 pr-2">{t.travel.toFixed(1)}</td>
                        <td className="py-2 pr-2">{t.accuracy.toFixed(1)}</td>
                        <td className="py-2 pr-2">{t.efficiency.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {best && (
                <p className="mt-4 font-medium">🏆 Best performing emoji: <span className="text-lg" aria-hidden>{best.emoji}</span> (accuracy {best.accuracy.toFixed(1)} px, efficiency {best.efficiency.toFixed(2)}).
                </p>
              )}
            </Card>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={reset}>Play Again</Button>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Challenge;
