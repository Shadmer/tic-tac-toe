import React from 'react';
import './App.css';
import img1 from './assets/img/layer-1.png';
import img2 from './assets/img/layer-2.png';
import img3 from './assets/img/layer-3.png';
import img4 from './assets/img/layer-4.jpg';

const App = () => {
    return (
        <>
            <header>
                <div className="scene">
                    <div
                        className="layer"
                        style={{ backgroundImage: `url(${img4})` }}
                    ></div>
                    <div
                        className="layer"
                        style={{ backgroundImage: `url(${img3})` }}
                    >
                        <div className="layer__content">
                            <h1>
                                Deep Scroll <br /> HTML / CSS
                            </h1>
                        </div>
                    </div>
                    <div
                        className="layer"
                        style={{ backgroundImage: `url(${img2})` }}
                    ></div>
                    <div
                        className="layer"
                        style={{ backgroundImage: `url(${img1})` }}
                    ></div>
                    <div className="layer">
                        <div className="layer__end">
                            <h3>End of scroll</h3>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default App;
