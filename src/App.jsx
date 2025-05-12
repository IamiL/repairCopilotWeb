import React, {useEffect, useState} from 'react';
import Chat from './Chat';
import './App.css';

function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light'); // Сохраняем состояние темы

    // Сохраняем тему в localStorage при её переключении
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme); // Устанавливаем атрибут для html
    }, [theme]);

    // Переключение темы
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="App">
            <header className="menu">
                <h1 className="app-title">Второй Пилот</h1>
                <button className="theme-toggle-button" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
                </button>
            </header>
            <Chat />
        </div>
    );
}

export default App;
