export function extractKeywords(text: string, topN = 5): string[] {
  if (!text) {
    return [];
  }

  const stopwords = new Set([
    "the",
    "is",
    "in",
    "and",
    "of",
    "a",
    "to",
    "for",
    "on",
    "with",
    "as",
    "by",
  ]);

  const freq: Record<string, number> = {};

  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove non-alphanumeric characters
    .split(/\s+/) // split by whitespaces
    .forEach((word) => {
      if (word && !stopwords.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}
