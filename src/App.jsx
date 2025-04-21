import React, { useState } from 'react';
import { Scene } from './Scene.jsx';


const IntroScreen = ({ onStart }) => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-800/25 to-gray-900/50">
        <h1 className="text-4xl font-bold text-white mb-8">R3F ECS template</h1>
        <button
            onClick={onStart}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            start
        </button>
    </div>
);

const App = () => {
    const [screen, setScreen] = useState('intro');

    const handleStart = () => {
        setScreen('game');
    };

    return (
        <div className="w-full h-full overflow-hidden">
            {screen === 'intro' && <IntroScreen onStart={handleStart} />}
            {screen === 'game' && <Scene />}
        </div>
    );
};

export default App;
