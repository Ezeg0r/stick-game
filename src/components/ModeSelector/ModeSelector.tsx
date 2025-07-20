import React from 'react';
import { gameModes } from '../../utils/constants.ts';
import type {GameMode} from '../../utils/constants.ts'
import Button from '../Button/Button.tsx'
type Props = {
    onSelect: (mode: GameMode) => void;
};

const ModeSelector: React.FC<Props> = ({ onSelect }) => {
    return (
        <div className="flex flex-col items-center p-6 gap-6 bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800">Выберите режим игры</h2>
            <div className="flex flex-col w-full gap-3">
                {Object.entries(gameModes).map(([key, label]) => (
                    <Button
                        key={key}
                        onClick={() => onSelect(key as GameMode)}
                        className=""
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>


    );
};

export default ModeSelector;
