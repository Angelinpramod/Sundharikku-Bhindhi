export function countEmojiTokens(emoji: string): number {
  const anyIntl: any = Intl as any;
  try {
    if (anyIntl && anyIntl.Segmenter) {
      const seg = new anyIntl.Segmenter(undefined, { granularity: "grapheme" });
      const it = seg.segment(emoji)[Symbol.iterator]();
      let c = 0;
      while (!it.next().done) c++;
      return c || 0;
    }
  } catch {}
  return Array.from(emoji || "").length || 0;
}
