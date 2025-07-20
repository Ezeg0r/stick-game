// src/utils/moveFinder.ts

let cache: number[][] = []

export async function loadPrecomputedData(): Promise<void> {
    if (cache.length) return; // уже загружено

    const response = await fetch('../../public/precomputed.txt');
    const text = await response.text();


    const lines = text.split('\n');
    for (const line of lines) {
        cache.push(line.trim().split(' ').map(val => Number(val)));
    }

}

export function bestSpecialMove(position: boolean[]): number[] {
    if (!cache) {
        throw new Error('Precomputed data not loaded. Call loadPrecomputedData() first.');
    }
    const temp = [...position];
    while(temp.length < 20)temp.push(false)
    let idx: number = 0;
    for (let i = 0; i < temp.length; i++) {
        if(temp[i])idx += Math.pow(2, (20 - i - 1))
    }
    return cache[idx]
}
