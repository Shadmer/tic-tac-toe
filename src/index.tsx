import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import App from './App';
import './styles/index.css';
import './assets/fonts/ofont.ru_InkVerse.ttf';

const theme = createTheme({
    cursorType: 'pointer',
});
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <App />
        </MantineProvider>
    </React.StrictMode>
);
