import { useState } from 'react';
import ModeSelector from './components/ModeSelector/ModeSelector.tsx';
import GameBoard from './GameBoard';
import type {GameMode} from './utils/constants.ts';
import {gameModes} from './utils/constants.ts';
import Modal from './components/Modal/Modal.tsx'
import Button from "./components/Button/Button.tsx";
import { MenuItem, Select, Slider} from "@mui/material";



function App() {
    const [chosenMode, setChosenMode] = useState<GameMode>("Standard");
    const [mode, setMode] = useState<GameMode | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [k, setK] = useState(5);
    const [range, setRange] = useState<[number, number]>([1, 3]);
    const[player, setPlayer] = useState<"player" | 'computer'>('player');


    const handleModeSelector  = (mode : GameMode) => {
        setOpenModal(true);
        setChosenMode(mode)
        if (mode == "Special")setK(Math.min(k, 20))
    }

    const exitGame = () => {
        setMode(null);
    }


    const handleModalClose = () => {
        setOpenModal(false);
    }
    const handleModal = () => {
        setOpenModal(false);
        setMode(chosenMode);
        if (chosenMode == 'Special')
            setRange([1, 3]);
    }

    const handleChangeK = (_event: Event, newValue: number) => {
        if (Number.isInteger(newValue)) {
            setK(newValue)
            setRange([Math.min(newValue, range[0]), Math.min(newValue, range[1])])
        }
    };

    const handleChangeRange = (_event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setRange(newValue as [number, number]);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {!mode ? (
                <>
                    <ModeSelector onSelect={handleModeSelector} />
                    <Modal isOpen={openModal} title={"Режим игры: " + gameModes[chosenMode]} onClose={handleModalClose}>
                        <div className="p-6 space-y-6">
                            {chosenMode == 'Standard' && (
                                <h2 className="text-sm font-semibold text-gray-500 mb-2">Можно выбирать любые палочки</h2>
                            )}
                            {chosenMode == "Consecutive" && (
                                <h2 className="text-sm font-semibold text-gray-500 mb-2">Можно выбирать палочки только подряд</h2>
                            )}
                            {chosenMode == "Special" && (
                                <h2 className="text-sm font-semibold text-gray-500 mb-2">За ход разрешается взять либо 3 подряд идущих палочки, либо 1 любую палочку, либо 2 любые палочки.</h2>
                            )}

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Количество палочек на доске: <span className="text-indigo-600 font-bold">{k}</span></h2>
                                <Slider
                                    getAriaLabel={() => 'Количество палочек'}
                                    value={k}
                                    onChange={handleChangeK}
                                    valueLabelDisplay="auto"
                                    min={5}
                                    max={chosenMode == 'Special' ? 20 : 50}
                                    step={1}
                                />
                            </div>

                            <div>

                                {chosenMode != 'Special' && (
                                    <>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                        Можно брать от <span className="text-green-600 font-bold">{range[0]}</span> до <span className="text-green-600 font-bold">{range[1]}</span> палочек
                                    </h2>
                                    <Slider
                                        getAriaLabel={() => 'Диапазон выбора'}
                                        value={range}
                                        onChange={handleChangeRange}
                                        valueLabelDisplay="auto"
                                        min={1}
                                        max={k}
                                        step={1}
                                    />
                                    </>)}
                            </div>



                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Первым ходит:</h2>
                                <Select
                                    value={player}
                                    onChange={(e) => setPlayer(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Выбор игрока' }}
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <MenuItem value={"player"}>Игрок</MenuItem>
                                    <MenuItem value={"computer"}>Компьютер</MenuItem>
                                </Select>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleModal}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
                                >
                                    Начать игру
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
) : (
                <div className="text-center">
                    <GameBoard
                        mode={mode}
                        numberOfSticks={k}
                        minSticks={range[0]}
                        maxSticks={range[1]}
                        exitGame={exitGame}
                        firstPlayer={player}
                    />
                </div>
)}
    </div>
);
}

export default App;
