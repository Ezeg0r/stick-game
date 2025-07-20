export function bestStandardMove(n: number, a: number, b: number): number {
    const dp: number[] = new Array(n + 1).fill(0);
    const pr: number[][] = Array.from({ length: n + 1 }, () => []);

    for (let i = a; i <= n; i++) {
        for (let j = a; j <= b; j++) {
            if (i - j >= 0) {
                if (dp[i - j] === 0) {
                    dp[i] = 1;
                    pr[i].push(j);
                }
            }
        }
    }

    const options = pr[n];
    if (options.length === 0) return 0;
    return options[Math.floor(Math.random() * options.length)];
}


type Pair = [number, number];

function computeSG(maxN: number, a: number, b: number): number[] {
    const sg: number[] = Array(maxN + 1).fill(0);

    for (let len = 1; len <= maxN; len++) {
        const mexSet = new Set<number>();

        for (let k = a; k <= b && k <= len; k++) {
            for (let start = 0; start + k <= len; start++) {
                const left = start;
                const right = len - start - k;
                const g = sg[left] ^ sg[right];
                mexSet.add(g);
            }
        }

        let g = 0;
        while (mexSet.has(g)) g++;
        sg[len] = g;
    }

    return sg;
}

export function bestConsecutiveMove(sticks: boolean[], a: number, b: number): Pair {
    const n = sticks.length;
    const segments: Pair[] = [];

    for (let i = 0; i < n;) {
        if (!sticks[i]) {
            i++;
            continue;
        }

        let j = i;
        while (j < n && sticks[j]) j++;
        segments.push([i, j - i]);
        i = j;
    }

    let maxLen = 0;
    for (const [, length] of segments) {
        maxLen = Math.max(maxLen, length);
    }

    const sg = computeSG(maxLen, a, b);
    let totalXor = 0;

    for (const [, length] of segments) {
        totalXor ^= sg[length];
    }

    if (totalXor === 0) return [-1, 0];

    const variants: Pair[] = [];

    for (const [startIdx, length] of segments) {
        const segGrundy = sg[length];

        for (let k = a; k <= b && k <= length; k++) {
            for (let offset = 0; offset + k <= length; offset++) {
                const left = offset;
                const right = length - offset - k;
                const newGrundy = totalXor ^ segGrundy ^ (sg[left] ^ sg[right]);

                if (newGrundy === 0) {
                    return [startIdx + offset, k];
                } else {
                    variants.push([startIdx + offset, k]);
                }
            }
        }
    }

    return variants[Math.floor(Math.random() * variants.length)];
}
