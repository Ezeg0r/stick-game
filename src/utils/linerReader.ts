// src/utils/moveFinder.ts

const data = new Map<string, string>()

export async function loadPrecomputedData(): Promise<void> {
    if (data.size) return;

    const response = await fetch(import.meta.env.BASE_URL + 'precomputed.txt');
    const text = await response.text();


    const lines = text.split('\n');
    for (const line of lines) {
        if (!line.length) continue;
        const array = line.split('=')[0].split(' ').map(Number);
        const move = line.split('=')[1].split(' ').map(Number);
        array.splice(array.length - 1, 1);
        move.splice(move.length - 1, 1);
        data.set(JSON.stringify(array), JSON.stringify(move));
    }

}

export function bestSpecialMove(sticksSegs: [number, number][]): number[] {
    if (!data.size) {
        throw new Error('Precomputed data not loaded. Call loadPrecomputedData() first.');
    }
    const segs = [...sticksSegs];

    segs.sort((a, b) => a[1] - b[1])
    const move =data.get(JSON.stringify(segs.map(val => val[1])));
    if (move === undefined){
        throw new Error('Нет такого хода');
    }
    const res = JSON.parse(move)
    const toDelete:number[] = []
    if (res[0] == 1){
        toDelete.push(segs[res[1]][0] + res[2])
    }
    if(res[0] == 2){
        toDelete.push(segs[res[1]][0] + res[2])
        toDelete.push(segs[res[3]][0] + res[4])
    }
    if(res[0] == 3){
        toDelete.push(segs[res[1]][0] + res[2])
        toDelete.push(segs[res[1]][0] + res[2] + 1)
        toDelete.push(segs[res[1]][0] + res[2] + 2)
    }
    return toDelete;
}
