import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GameBoard, { PlacementNorm, TARGET_DEFAULT } from "@/components/game/GameBoard";
import Scoreboard, { RankedRow } from "@/components/game/Scoreboard";
import portraitHero from "@/assets/portrait-hero.jpg";
import { Link } from "react-router-dom";

// Common emojis for quick selection
const commonEmojis = [
  "🔴","🔵","🟢","⚫","⚪","❤","💙","💚","💛","💜",
  "🌟","✨","👑","🔥","🎯","😎","😂","🤡","🥳"
];

function countEmojiTokens(emoji: string): number {
  // Approximate token count by grapheme clusters (works well for emojis)
  const anyIntl: any = Intl as any;
  if (anyIntl && anyIntl.Segmenter) {
    const seg = new anyIntl.Segmenter(undefined, { granularity: "grapheme" });
    const it = seg.segment(emoji)[Symbol.iterator]();
    let c = 0;
    while (!it.next().done) c++;
    return c || 0;
  }
  return Array.from(emoji).length || 0;
}

const TARGET_NORM = TARGET_DEFAULT; // between eyebrows

type Phase = "start" | "countdown" | "game" | "reveal" | "scoreboard";

const Index = () => {
  // SEO
  useEffect(() => {
    document.title = "Sundharikku Bhindhi – Multiplayer Emoji Game";
    const ensureMeta = (name: string, content: string) => {
      let m = document.querySelector(`meta[name="${name}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", name);
        document.head.appendChild(m);
      }
      m.setAttribute("content", content);
    };
    ensureMeta("description", "Play Sundharikku Bhindhi: place your emoji closest to the target and win.");
    ensureMeta("robots", "index,follow");
  }, []);

  const [phase, setPhase] = useState<Phase>("start");
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🔴");
  const [placements, setPlacements] = useState<PlacementNorm[]>([]);
  const [boardDims, setBoardDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Image state
  const [spin, setSpin] = useState(false);
  const [imgHidden, setImgHidden] = useState(false);

  // Scores for scoreboard
  const [ranked, setRanked] = useState<RankedRow[]>([]);

  // Start flow
  const onStart = useCallback(() => {
    setPhase("countdown");
    // After countdown (approx 3 * 800ms + a bit)
    setTimeout(() => {
      setPhase("game");
      setSpin(true);
      // Hide image after 5s
      setTimeout(() => {
        setSpin(false);
        setImgHidden(true);
      }, 5000);
    }, 2800);
  }, []);

  // Place emoji for current player
  const handlePlace = useCallback(
    (xNorm: number, yNorm: number) => {
      // if this player already placed, ignore
      if (placements.some((p) => p.player === currentPlayer)) return;

      const placement: PlacementNorm = { player: currentPlayer, emoji: selectedEmoji, xNorm, yNorm };
      setPlacements((prev) => [...prev, placement]);

      if (currentPlayer >= playerCount) {
        // All done -> reveal image with placements, then scoreboard
        setImgHidden(false);
        setPhase("reveal");
        setTimeout(() => {
          const scores = computeScores([...placements, placement], boardDims.width, boardDims.height);
          setRanked(scores);
          setPhase("scoreboard");
        }, 5000);
      } else {
        setCurrentPlayer((p) => p + 1);
      }
    },
    [currentPlayer, playerCount, placements, selectedEmoji, boardDims.height, boardDims.width]
  );

  const computeScores = (
    list: PlacementNorm[],
    imageWidth: number,
    imageHeight: number
  ): RankedRow[] => {
    const target = { x: TARGET_NORM.x * imageWidth, y: TARGET_NORM.y * imageHeight };
    const results = list.map((p) => {
      const x = p.xNorm * imageWidth;
      const y = p.yNorm * imageHeight;
      const dx = x - target.x;
      const dy = y - target.y;
      const distance = Math.hypot(dx, dy);
      return {
        player: p.player,
        emoji: p.emoji,
        tokenCount: countEmojiTokens(p.emoji || ""),
        distance,
      } as RankedRow;
    });

    return results.sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      return a.tokenCount - b.tokenCount;
    });
  };

  const turnLabel = useMemo(() => {
    if (phase === "scoreboard") return "Game Over";
    if (currentPlayer > playerCount) return "All done";
    return `Player ${currentPlayer}'s Turn`;
  }, [currentPlayer, phase, playerCount]);

  return (
    <main className="min-h-screen py-10">
      <section className="container">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Sundharikku Bhindhi</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Place your emoji as close as possible to the secret spot. Fewer tokens and
            shorter distance rank higher.
          </p>
          <div className="mt-4 flex justify-center">
            <Button asChild variant="secondary" className="hover-scale"><Link to="/challenge">Try Challenge Mode</Link></Button>
          </div>
        </header>

        {/* Start Screen */}
        {phase === "start" && (
          <Card className="max-w-xl mx-auto p-6 animate-scale-in">
            <div className="flex flex-col items-center gap-4">
              <label className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Number of players</span>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={playerCount}
                  onChange={(e) => setPlayerCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                  className="w-24 text-center"
                  aria-label="Number of players"
                />
              </label>
              <Button onClick={onStart} variant="default" className="hover-scale">
                Start
              </Button>
            </div>
          </Card>
        )}

        {/* Countdown overlay mimic */}
        {phase === "countdown" && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in">
            <div className="text-7xl font-extrabold text-background">3</div>
          </div>
        )}

        {/* Game Area */}
        {(phase === "game" || phase === "reveal") && (
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start animate-enter">
            <aside className="space-y-4">
              <Card className="p-4">
                <div className="text-sm font-semibold" aria-live="polite">{turnLabel}</div>
                <div className="mt-3 text-sm">Selected: <span className="text-lg" aria-hidden>{selectedEmoji}</span></div>
              </Card>

              <Card className="p-3">
                <div className="text-sm font-medium mb-2">Pick an emoji</div>
                <div className="flex gap-2 overflow-x-auto">
                  {commonEmojis.map((e) => (
                    <button
                      key={e}
                      onClick={() => setSelectedEmoji(e)}
                      className={
                        "rounded-md px-3 py-2 border hover-scale " +
                        (selectedEmoji === e ? "bg-secondary" : "bg-background")
                      }
                      aria-label={`Select emoji ${e}`}
                    >
                      <span className="text-xl" aria-hidden>{e}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </aside>

            <div>
              <GameBoard
                imageUrl={portraitHero}
                placements={placements}
                isHidden={imgHidden}
                spin={spin}
                showTarget={phase === "reveal"}
                targetNorm={TARGET_NORM}
                onPlace={handlePlace}
                onMeasured={setBoardDims}
              />
              <p className="text-center text-sm text-muted-foreground mt-3">
                Tip: Click on the portrait area to place your emoji.
              </p>
            </div>
          </div>
        )}

        {/* Scoreboard */}
        {phase === "scoreboard" && (
          <div className="mt-8 animate-fade-in">
            <Scoreboard ranked={ranked} />
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
