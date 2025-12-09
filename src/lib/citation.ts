/**
 * Extracts a DOI from a citation string.
 * Returns undefined when no DOI-like pattern is found.
 */
export const extractDoiFromCitation = (citation?: string) => {
  if (!citation) return undefined;

  const normalized = citation.trim();

  // Match the last DOI-like occurrence to avoid leading prose.
  const matches = normalized.match(/10\.\d{4,9}\/[0-9A-Z._;()/:+-]+/gi);

  if (!matches || matches.length === 0) {
    return undefined;
  }

  const candidate = matches[matches.length - 1];

  // Strip trailing punctuation such as commas or periods.
  return candidate.replace(/[),.;]+$/, "");
};
