import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type RankedRow = {
  player: number;
  emoji: string;
  tokenCount: number;
  distance: number; // pixels
};

type ScoreboardProps = {
  ranked: RankedRow[];
};

export default function Scoreboard({ ranked }: ScoreboardProps) {
  return (
    <section className="w-full max-w-2xl mx-auto animate-fade-in">
      <header className="mb-4 text-center">
        <h2 className="text-2xl font-semibold">Scoreboard</h2>
        <p className="text-muted-foreground text-sm">Closest distance wins. Ties broken by fewer emoji tokens.</p>
      </header>

      <Card className="p-4">
        <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-2">
          <div className="col-span-2">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-3">Emoji / Tokens</div>
          <div className="col-span-3 text-right">Distance (px)</div>
        </div>
        <Separator className="my-2" />
        <div className="space-y-2">
          {ranked.map((r, idx) => (
            <div
              key={`r-${r.player}`}
              className={
                "grid grid-cols-12 items-center rounded-md px-2 py-2 transition-colors " +
                (idx === 0 ? "bg-accent/60" : "hover:bg-muted/50")
              }
            >
              <div className="col-span-2 font-semibold">#{idx + 1}</div>
              <div className="col-span-4">Player {r.player}</div>
              <div className="col-span-3 flex items-center gap-2">
                <span className="text-lg" aria-hidden>
                  {r.emoji}
                </span>
                <span className="text-xs text-muted-foreground">{r.tokenCount} token{r.tokenCount === 1 ? "" : "s"}</span>
              </div>
              <div className="col-span-3 text-right font-mono">{r.distance.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
