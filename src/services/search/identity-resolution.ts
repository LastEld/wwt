/**
 * Computes the Levenshtein distance between two strings.
 */
function levenshtein(a: string, b: string): number {
    const tmp = [];
    let i, j, alen = a.length, blen = b.length;
    if (alen === 0) return blen;
    if (blen === 0) return alen;
    for (i = 0; i <= alen; i++) tmp[i] = [i];
    for (j = 0; j <= blen; j++) tmp[0][j] = j;
    for (i = 1; i <= alen; i++) {
        for (j = 1; j <= blen; j++) {
            tmp[i][j] = Math.min(
                tmp[i - 1][j] + 1,
                tmp[i][j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return tmp[alen][blen];
}

/**
 * Normalizes a string for comparison by removing common words and punctuation.
 */
function normalizeName(name: string): string {
    return name
        .toLowerCase()
        .replace(/hotel|resort|spa|&|and|the| boutique/gi, "")
        .replace(/[^\w\s]/g, "")
        .trim()
        .replace(/\s+/g, " ");
}

/**
 * Creates a geogrid bucket key for a given coordinate.
 * Precision: 100m (approx 0.001 fractional degrees)
 */
function getGeoGrid(lat: number, lng: number): string {
    const precision = 0.001;
    const latKey = Math.floor(lat / precision);
    const lngKey = Math.floor(lng / precision);
    return `${latKey},${lngKey}`;
}

/**
 * Determines if two hotels are likely the same entity.
 */
export function areSameHotels(h1: { name: string; lat: number; lng: number }, h2: { name: string; lat: number; lng: number }): boolean {
    // 1. Check geo grid first (Fast filter)
    if (getGeoGrid(h1.lat, h1.lng) !== getGeoGrid(h2.lat, h2.lng)) return false;

    // 2. Perform string similarity check
    const n1 = normalizeName(h1.name);
    const n2 = normalizeName(h2.name);

    if (n1 === n2) return true;

    const distance = levenshtein(n1, n2);
    const maxLength = Math.max(n1.length, n2.length);

    // Similarity threshold: 0.8
    const similarity = 1 - distance / maxLength;
    return similarity > 0.8;
}
