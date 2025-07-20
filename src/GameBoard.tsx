import React, { useEffect, useState, } from 'react';
import Stick from './components/Stick/Stick.tsx';
import {type GameMode, gameModes} from './utils/constants.ts';
import Button from "./components/Button/Button.tsx";
import { bestStandardMove, bestConsecutiveMove} from "./utils/ai.ts";
import {bestSpecialMove, loadPrecomputedData} from "./utils/linerReader.ts";

type GameBoardProps = {
    mode: GameMode;
    exitGame: () => void;
    numberOfSticks: number;
    minSticks: number;
    maxSticks: number;
    firstPlayer: 'player' | 'computer';
};

const GameBoard: React.FC<GameBoardProps> = ({ mode, exitGame, numberOfSticks, minSticks, maxSticks, firstPlayer}) => {
    const [sticks, setSticks] = useState<Array<"selected" | "default" | "disabled" | "last">>(Array(numberOfSticks).fill('default'));
    const [player, setPlayer] = useState<"player" | "computer">(firstPlayer);
    const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

    const selectedSticksIndexes = sticks.map((val, i) => val == 'selected' ? i : null).filter(val => val != null);
    const aliveSticksIndexes = sticks.map((val, i) => val == 'default' || val == 'selected' ? i : null).filter(val => val != null);
    const aliveSticks = sticks.map((val) => val == "default" || val == 'selected');
    const sticksSegs: [number, number][]= []
    for (let i = 0; i < aliveSticks.length; i++) {
        let j = i;
        while(j < aliveSticks.length && aliveSticks[j])j++;
        if (j - i)sticksSegs.push([i, j - i])
        i = j;
    }

    const gameOver = () => {
        if (player === "player") {
            alert("Вы проиграли!")
        }
        else{
            alert("Вы выйграли!")
        }
        exitGame()
    }


    useEffect(() => {
        const init = async () => {
            await loadPrecomputedData();
            setIsDataLoaded(true);
        };

        if (mode == 'Special'){
            init();
        }
    }, [mode])

    useEffect(() => {
        let maxSeg = 0;
        sticksSegs.forEach(val => maxSeg = Math.max(maxSeg, val[1]))

        if (aliveSticksIndexes.length < minSticks || (mode == 'Consecutive' && maxSeg < minSticks)){
            setTimeout(() => {
                gameOver();
            }, 100);
        }
    });


    if (player == "computer" && aliveSticksIndexes.length >= minSticks) {
        let maxSeg = 0;
        sticksSegs.forEach(val => maxSeg = Math.max(maxSeg, val[1]))

        if (!(aliveSticksIndexes.length < minSticks || (mode == 'Consecutive' && maxSeg < minSticks))){
            if (mode == "Standard") {
                const tempDefaultSticks = [...aliveSticksIndexes];

                let result = bestStandardMove(tempDefaultSticks.length, minSticks, maxSticks);
                if(result == 0)result = minSticks;
                const toDelete: number[] = []

                while (result--) {
                    const random = Math.floor(Math.random() * tempDefaultSticks.length);
                    toDelete.push(tempDefaultSticks[random]);
                    tempDefaultSticks.splice(random, 1);
                }
                setTimeout( () => {
                    setSticks(sticks.map((val, i) => {
                        if (toDelete.includes(i)) return 'last';
                        if (val == 'last') return 'disabled';
                        return val;
                    }))
                    setPlayer("player");
                }, 500)

            }
            if (mode == "Consecutive"){
                const aliveSticks = sticks.map((val) => val == "default")

                let [from, n] = bestConsecutiveMove(aliveSticks, minSticks, maxSticks);
                console.log(from, n)

                if (from == -1){
                    for (let i = 0; i < sticksSegs.length; i++) {
                        if (sticksSegs[i][1] >= minSticks) {
                            from = sticksSegs[i][0]
                            n = minSticks;
                        }
                    }
                    console.assert(from != -1)
                }
                setTimeout( () => {
                    setSticks(sticks.map((val, i) => {
                        if (i >= from && i < from + n)return 'last';
                        if (val == 'last') return 'disabled';
                        return val;
                    }));
                    setPlayer("player");
                }, 500)
            }
            if (mode == "Special" && isDataLoaded){
                const toDelete = bestSpecialMove(sticksSegs)
                console.log(toDelete);
                setPlayer("player");
                setTimeout( () => {
                    setSticks(sticks.map((val, i) => {
                        if (toDelete.includes(i))return 'last';
                        if (val == 'last') return 'disabled';
                        return val;
                    }));
                    setPlayer("player");
                }, 500)
                }

        }
    }

    const toggleSelect = (index: number) => {
        if (player == "computer")return;
        if (sticks[index] == 'default')
            setSticks(sticks.map((val, i) => i == index ? 'selected' : val));
        else if (sticks[index] == 'selected')
            setSticks(sticks.map((val, i) => i == index ? 'default' : val));
    }

    const takeSticks = () => {
        switch (mode) {
            case 'Standard' : {
                console.log(selectedSticksIndexes.length);
                if (selectedSticksIndexes.length < minSticks) {
                    alert("Выберите больше палочек!")
                    return;
                }
                if (selectedSticksIndexes.length > maxSticks) {
                    alert("Выберите меньше палочек!")
                    return;
                }
                setSticks(sticks.map((val) => val == 'selected' ? 'disabled' : val));
                setPlayer("computer")
                break;
            }
            case 'Consecutive' : {
                if (selectedSticksIndexes.length < minSticks) {
                    alert("Выберите больше палочек!")
                    return;
                }
                if (selectedSticksIndexes.length > maxSticks) {
                    alert("Выберите меньше палочек!")
                    return;
                }
                let ok = true;
                for (let i = 1; i < selectedSticksIndexes.length; i++) {
                    if (selectedSticksIndexes[i] - selectedSticksIndexes[i - 1] != 1) ok = false;
                }
                if (!ok) {
                    alert("Палочки идут не подряд!")
                    return;
                }
                setSticks(sticks.map((val) => val == 'selected' ? 'disabled' : val));
                setPlayer("computer")
                break;
            }
            case 'Special': {
                if (selectedSticksIndexes.length < minSticks) {
                    alert("Выберите больше палочек!")
                    return;
                }
                if (selectedSticksIndexes.length > maxSticks) {
                    alert("Выберите меньше палочек!")
                    return;
                }
                if (selectedSticksIndexes.length != 3){
                    setSticks(sticks.map((val) => val == 'selected' ? 'disabled' : val));
                    setPlayer("computer")
                }
                else {
                    let ok = true;
                    for (let i = 1; i < selectedSticksIndexes.length; i++) {
                        if (selectedSticksIndexes[i] - selectedSticksIndexes[i - 1] != 1) ok = false;
                    }
                    if (!ok) {
                        alert("Палочки идут не подряд!")
                        return;
                    }
                    setSticks(sticks.map((val) => val == 'selected' ? 'disabled' : val));
                    setPlayer("computer")
                }
                break;
            }
        }
    }

    return (
        <div className="flex flex-col justify-between items-center h-dvh w-dvw bg-gradient-to-br from-emerald-400 to-emerald-600 py-10 px-4">
            <div className="font-main text-8xl font-extrabold text-white drop-shadow-lg mb-4">Stick Game</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Режим: <span className="text-cyan-800">{gameModes[mode]}</span><br/>
                <span className="text-cyan-800">{numberOfSticks}</span> палочек,
                от <span className="text-cyan-800">{minSticks}</span> до <span
                className="text-cyan-800 font-bold">{maxSticks}</span>
            </h1>
            <div className="flex justify-center items-center h-1/2 bg-amber-100 max-w-10/11 px-10 rounded-2xl">
                {sticks.map((type, i) => (
                    <Stick
                        key={i}
                        index={i}
                        onClick={toggleSelect}
                        type={type}
                    />
                ))}
            </div>

            <div className="flex gap-6 mt-8">
                <Button
                    variant="primary"
                    onClick={takeSticks}
                    disabled={player === 'computer'}
                    className="px-6 py-3 text-lg rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                    Взять палочки
                </Button>

                <Button
                    variant="danger"
                    onClick={exitGame}
                    className="px-6 py-3 text-lg rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                    Выйти
                </Button>
            </div>
        </div>

    );
};

export default GameBoard;
