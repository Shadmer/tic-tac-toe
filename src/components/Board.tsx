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
    Progress,
    RangeSlider,
    RangeSliderValue,
    Tooltip,
} from '@mantine/core';

import { Square } from './Square';
import { SquareType } from './types';

import classes from '../styles/board.module.css';
import {
    calculateBotMove,
    calculateWinner,
    getRandomColor,
} from '../utils/utils';

export const Board = () => {
    const defaultSquares: SquareType[] = Array(9).fill(null);
    const defaultDuration: RangeSliderValue = [1000, 3000];
    const difficultyLevels = [
        { value: 1, label: 'Простак' },
        { value: 2, label: 'Любитель' },
        { value: 3, label: 'Савант' },
    ];

    const [duration, setDuration] =
        React.useState<RangeSliderValue>(defaultDuration);
    const [progressValue, setProgressValue] = React.useState<number>(100);
    const [isBotGame, setIsBotGame] = React.useState(false);
    const [isBotTurn, setIsBotTurn] = React.useState(false);
    const [isBotFirst, setIsBotFirst] = React.useState(false);
    const [isTimer, setIsTimer] = React.useState(true);
    const [botLevel, setBotLevel] = React.useState(2);
    const [xIsNext, setXIsNext] = React.useState(true);
    const [squares, setSquares] = React.useState<SquareType[]>(defaultSquares);
    const [moves, setMoves] = React.useState<number[]>([]);
    const [resetFlag, setResetFlag] = React.useState(false);
    const [isTimerOut, setIsTimerOut] = React.useState(false);
    const [isWinnerByTime, setIsWinnerByTime] = React.useState(false);

    const [winningCombination, setWinningCombination] = React.useState<
        number[] | null
    >(null);

    const lastResetDurationRef = React.useRef<number>(duration[1]);
    const timerRunningRef = React.useRef<boolean>(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    const oldestMove = React.useMemo(
        () => moves.length > 5 && moves[0],
        [moves]
    );

    const winner = React.useMemo(
        () => isTimerOut || calculateWinner(squares, setWinningCombination),
        [squares, isTimerOut]
    );

    const status = React.useMemo(() => {
        const current = xIsNext ? 'Х' : 'О';
        const next = !xIsNext ? 'Х' : 'О';

        return winner ? `Победитель: ${next}` : `Следующий ход: ${current}`;
    }, [winner, xIsNext]);

    const gradient = React.useMemo(() => {
        return {
            from: getRandomColor(),
            to: getRandomColor(),
            deg: Math.floor(Math.random() * 360),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFlag]);

    const startCountdown = React.useCallback(() => {
        if (!isTimer || timerRunningRef.current) return;

        timerRunningRef.current = true;
        let remainingTime = lastResetDurationRef.current;
        const step = 50;

        intervalRef.current = setInterval(() => {
            remainingTime -= step;

            if (remainingTime <= 0) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
                timerRunningRef.current = false;
                lastResetDurationRef.current = duration[1];

                setIsTimerOut(true);
                setIsWinnerByTime(true);
                setProgressValue(100);
            } else {
                const progress = (remainingTime / duration[1]) * 100;
                setProgressValue(progress);
            }
        }, step);
    }, [duration, isTimer]);

    const resetCountdown = React.useCallback(() => {
        if (!timerRunningRef.current) return;

        clearInterval(intervalRef.current as NodeJS.Timeout);
        timerRunningRef.current = false;
        lastResetDurationRef.current = Math.max(
            duration[0],
            lastResetDurationRef.current - 100
        );

        setProgressValue(100);
        startCountdown();
    }, [duration, startCountdown]);

    const stopCountdown = React.useCallback(() => {
        if (!timerRunningRef.current) return;

        clearInterval(intervalRef.current as NodeJS.Timeout);
        timerRunningRef.current = false;

        setIsTimerOut(true);
        setProgressValue(100);
    }, []);

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
            resetCountdown();
        },
        [moves, resetCountdown, squares, xIsNext]
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

    const resetGame = React.useCallback(() => {
        setResetFlag((prev) => !prev);
        setWinningCombination(null);
        setSquares(defaultSquares);
        setXIsNext(true);
        setMoves([]);
        setIsBotTurn(isBotGame ? isBotFirst : false);
        stopCountdown();
        setIsTimerOut(false);
        setIsWinnerByTime(false);

        if (isBotGame && isBotFirst) setIsBotTurn(true);
    }, [defaultSquares, isBotFirst, isBotGame, stopCountdown]);

    const handleSquareClick = (i: number) => {
        if (
            isBotTurn ||
            squares[i] ||
            calculateWinner(squares, setWinningCombination)
        )
            return;
        startCountdown();
        makeMove(i);

        if (isBotGame) setIsBotTurn(true);
    };

    const handleResetGame = () => {
        resetGame();
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
        if (winner) stopCountdown();
    }, [stopCountdown, winner]);

    React.useEffect(() => {
        resetGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBotGame, isBotFirst, isTimer, botLevel]);

    const progressTimer = (
        <Progress radius="xs" color={gradient.to} value={progressValue} />
    );

    const sliderRangeTimer = (
        <RangeSlider
            color={gradient.to}
            minRange={1000}
            min={1000}
            max={5000}
            step={500}
            value={duration}
            onChange={setDuration}
            label={(value) => `${value / 1000} сек.`}
        />
    );

    return (
        <Paper radius="md" p="xl">
            <Stack>
                <Button
                    color={gradient.from}
                    size="xl"
                    onClick={handleResetGame}
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
                    />
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

                    <Tooltip label="Очередь хода бота" color={gradient.from}>
                        <Box
                            className={`${isBotGame ? classes.visible : classes.hidden}`}
                        >
                            <Chip
                                radius="xs"
                                color={gradient.to}
                                checked={isBotFirst}
                                onChange={() => setIsBotFirst((v) => !v)}
                            >
                                {isBotFirst ? 'Бот первый' : 'Бот второй'}
                            </Chip>
                        </Box>
                    </Tooltip>
                    <Tooltip
                        label="Мин. и макс. время на ход"
                        color={gradient.from}
                    >
                        <Box>
                            <Chip
                                radius="xs"
                                color={gradient.to}
                                checked={isTimer}
                                onChange={() => setIsTimer((v) => !v)}
                            >
                                Таймер
                            </Chip>
                        </Box>
                    </Tooltip>
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
                    {timerRunningRef.current ? progressTimer : sliderRangeTimer}
                </Box>

                <Text c={gradient.from}>
                    {status}
                    {winner && isWinnerByTime && (
                        <Text c={gradient.to}>по времени</Text>
                    )}
                </Text>
            </Stack>
        </Paper>
    );
};
