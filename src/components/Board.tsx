import React from 'react';

import {
    AspectRatio,
    Box,
    Button,
    Chip,
    Group,
    Paper,
    Text,
    SimpleGrid,
    Stack,
    Switch,
    Slider,
} from '@mantine/core';

import { Square } from './Square';
import { SquareType } from './types';

import classes from '../styles/board.module.css';
import {
    calculateBotMove,
    calculateWinner,
    getRandomColor,
} from '../utils/utils';
import { Timer } from './Timer';

export const Board = () => {
    const defaultSquares: SquareType[] = Array(9).fill(null);
    const difficultyLevels = [
        { value: 1, label: 'Простак' },
        { value: 2, label: 'Любитель' },
        { value: 3, label: 'Савант' },
    ];
    const [isBotGame, setIsBotGame] = React.useState(false);
    const [isBotTurn, setIsBotTurn] = React.useState(false);
    const [isBotFirst, setIsBotFirst] = React.useState(false);
    const [botLevel, setBotLevel] = React.useState(2);
    const [xIsNext, setXIsNext] = React.useState(true);
    const [squares, setSquares] = React.useState<SquareType[]>(defaultSquares);
    const [moves, setMoves] = React.useState<number[]>([]);
    const [resetFlag, setResetFlag] = React.useState(false);
    const [winningCombination, setWinningCombination] = React.useState<
        number[] | null
    >(null);
    const [isTimer, setIsTimer] = React.useState(true);

    const oldestMove = React.useMemo(
        () => moves.length > 5 && moves[0],
        [moves]
    );
    const winner = React.useMemo(
        () => calculateWinner(squares, setWinningCombination),
        [squares]
    );
    const status = React.useMemo(
        () =>
            winner
                ? `Победитель: ${winner}`
                : `Следующий ход: ${xIsNext ? 'Х' : 'О'}`,
        [winner, xIsNext]
    );
    const gradient = React.useMemo(() => {
        return {
            from: getRandomColor(),
            to: getRandomColor(),
            deg: Math.floor(Math.random() * 360),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFlag]);

    const makeMove = React.useCallback(
        (move: number) => {
            const nextSquares = squares.slice();
            const nextMoves = moves.slice();

            nextSquares[move] = xIsNext ? 'x' : 'o';
            nextMoves.push(move);

            if (nextMoves.length > 6) {
                const oldestMove = nextMoves.shift();
                nextSquares[oldestMove ?? -1] = null;
            }

            setSquares(nextSquares);
            setMoves(nextMoves);
            setXIsNext(!xIsNext);
        },
        [moves, squares, xIsNext]
    );
    const getBotMove = React.useCallback(async () => {
        if (winner) return;

        setIsBotTurn(true);

        const botMove = calculateBotMove(
            squares,
            moves,
            isBotFirst,
            botLevel,
            setWinningCombination
        );

        setTimeout(() => {
            makeMove(botMove);
            setIsBotTurn(false);
        }, 500);
    }, [botLevel, isBotFirst, makeMove, moves, squares, winner]);

    const handleSquareClick = (i: number) => {
        if (
            isBotTurn ||
            squares[i] ||
            calculateWinner(squares, setWinningCombination)
        )
            return;

        makeMove(i);

        if (isBotGame) setIsBotTurn(true);
    };
    const handleReset = () => {
        setResetFlag((prev) => !prev);
        setWinningCombination(null);
        setSquares(defaultSquares);
        setXIsNext(true);
        setMoves([]);
        setIsBotTurn(isBotGame ? isBotFirst : false);
        if (isBotGame && isBotFirst) setIsBotTurn(true);
    };

    React.useEffect(() => {
        if (isBotTurn) {
            getBotMove();
        }
    }, [getBotMove, isBotTurn]);
    React.useEffect(() => {
        setIsBotTurn(isBotFirst);
    }, [isBotFirst]);
    React.useEffect(() => {
        handleReset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBotGame, isBotFirst, botLevel]);

    const [timerDuration, setTimerDuration] = React.useState(5000);
    const handleStart = () => {
        console.log('Countdown started from parent component!');
        // Здесь вы можете выполнить любые действия, которые нужны вам при старте таймера
    };

    return (
        <Paper radius="md" p="xl">
            <Stack>
                <button onClick={handleStart}>timer start</button>
                <Button
                    color={gradient.from}
                    size="xl"
                    onClick={handleReset}
                    variant="outline"
                >
                    Новая игра
                </Button>

                <Box
                    className={`${isBotGame ? classes.visible : classes.hidden}`}
                >
                    <Text c={gradient.from}>Уровень бота: {botLevel}</Text>
                    <Slider
                        color={gradient.to}
                        marks={difficultyLevels}
                        label={(val) =>
                            difficultyLevels.find(
                                (level) => level.value === val
                            )?.label ?? ''
                        }
                        step={1}
                        min={1}
                        max={3}
                        value={botLevel}
                        onChange={setBotLevel}
                        styles={{ markLabel: { display: 'none' } }}
                    ></Slider>
                </Box>

                <Group justify="space-between" gap="sm">
                    <Switch
                        className={classes.switch}
                        size="xl"
                        color={gradient.from}
                        onLabel="БОТ"
                        offLabel="ЧЕЛОВЕК"
                        radius="xs"
                        checked={isBotGame}
                        onChange={(e) => setIsBotGame(e.currentTarget.checked)}
                    />

                    <Box
                        className={`${isBotGame ? classes.visible : classes.hidden}`}
                    >
                        <Chip
                            radius="xs"
                            color={gradient.to}
                            checked={isBotFirst}
                            onChange={() => setIsBotFirst((v) => !v)}
                        >
                            Бот первый
                        </Chip>
                    </Box>

                    <Chip
                        radius="xs"
                        color={gradient.to}
                        checked={isTimer}
                        onChange={() => setIsTimer((v) => !v)}
                    >
                        Таймер
                    </Chip>
                </Group>
                <Paper withBorder p="xs">
                    <AspectRatio>
                        <SimpleGrid cols={3}>
                            {squares.map((_, index) => (
                                <Square
                                    key={index}
                                    value={squares[index]}
                                    onSquareClick={() =>
                                        handleSquareClick(index)
                                    }
                                    isOldest={oldestMove === index}
                                    gradient={gradient}
                                    disabled={
                                        !!winner &&
                                        !winningCombination?.includes(index)
                                    }
                                />
                            ))}
                        </SimpleGrid>
                    </AspectRatio>
                </Paper>

                <Box
                    className={`${isTimer ? classes.visible : classes.hidden}`}
                >
                    <Timer
                        initialDuration={timerDuration}
                        color={gradient.to}
                    />
                </Box>

                <Text c={gradient.from}>{status}</Text>
            </Stack>
        </Paper>
    );
};
