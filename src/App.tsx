import React from 'react';

import { Box, Space, Title } from '@mantine/core';

import classes from './styles/app.module.css';

import img1 from './assets/img/layer-1.png';
import img2 from './assets/img/layer-2.png';
import img3 from './assets/img/layer-3.png';
import img4 from './assets/img/layer-4.jpg';

import { Board } from './components/Board';

const App = () => {
    return (
        <Box className={classes.scene}>
            <Box
                className={classes.layer}
                style={{ backgroundImage: `url(${img4})` }}
            ></Box>
            <Box
                className={classes.layer}
                style={{ backgroundImage: `url(${img3})` }}
            >
                <Box className={classes.layer__content}>
                    <Title>Мерцающие</Title>
                    <Space />
                    <Title>крестики-нолики</Title>
                    <Box className={classes.arrow_down} />
                </Box>
            </Box>
            <Box
                className={classes.layer}
                style={{ backgroundImage: `url(${img2})` }}
            ></Box>
            <Box
                className={classes.layer}
                style={{ backgroundImage: `url(${img1})` }}
            ></Box>
            <Box className={classes.layer}>
                <Box className={classes.layer__end}>
                    <Box className={classes.layer__board}>
                        <Board />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default App;
