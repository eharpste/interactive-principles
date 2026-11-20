// Citations are stored on each principle as a list of
// { label, url, kind } objects. `kind` says what role the source plays:
//   origin   - where the principle comes from
//   evidence - a review, meta-analysis, or key study supporting it
//   games    - a study or guide about the principle in games specifically
//
// Older data used a single `cited` string of comma-separated surnames
// ("Astleitner, Pashler"). normalizeCitations() accepts either shape so
// cards in the old format still render.

export const CITATION_KINDS = [
    { id: 'origin', label: 'Origin' },
    { id: 'evidence', label: 'Research' },
    { id: 'games', label: 'In games' }
];

const KNOWN_KINDS = CITATION_KINDS.map(k => k.id);

export function emptyCitation() {
    return { label: '', url: '', kind: 'origin' };
}

export function normalizeCitations(principle) {
    if (!principle) {
        return [];
    }

    if (Array.isArray(principle.citations)) {
        return principle.citations
            .filter(c => c && c.label && c.label.trim())
            .map(c => ({
                label: c.label.trim(),
                url: (c.url || '').trim(),
                kind: KNOWN_KINDS.includes(c.kind) ? c.kind : 'evidence'
            }));
    }

    if (typeof principle.cited === 'string' && principle.cited.trim()) {
        return principle.cited
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(label => ({ label, url: '', kind: 'origin' }));
    }

    return [];
}

// Groups citations by kind, in CITATION_KINDS order, dropping empty groups.
export function groupCitations(citations) {
    return CITATION_KINDS
        .map(kind => ({ ...kind, items: citations.filter(c => c.kind === kind.id) }))
        .filter(group => group.items.length > 0);
}

// Converts a principle still using the legacy `cited` string into the
// `citations` list format, so saving from the admin page writes the new shape.
export function migratePrincipleCitations(principle) {
    if (Array.isArray(principle.citations) || !('cited' in principle)) {
        return principle;
    }
    const { cited, ...rest } = principle;
    return { ...rest, citations: normalizeCitations({ cited }) };
}
