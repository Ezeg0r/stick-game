export const gameModes = {
    Standard: 'Стандартный',
    Consecutive: 'Подряд',
    Special: 'Особый',
} as const;

export type GameMode = keyof typeof gameModes;
