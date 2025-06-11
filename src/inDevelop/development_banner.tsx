import './development_banner.css';
import {useEffect, useState} from "react";

const DevelopmentBanner = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`development-banner ${isDark ? 'dark' : 'light'}`}>
      {/* Логотип */}
      <div className="logo-container">
        <svg 
          width="60" 
          height="60" 
          viewBox="0 0 71 71" 
          className="drop-shadow-lg"
        >
          <defs>
            <mask id="b" x="8.92" y="7.09" width="49.83" height="46.77" maskUnits="userSpaceOnUse">
              <g id="c">
                <path d="M45.87,53.81c3.92-3.34,6.47-8.53,6.63-15.18.18-7.33-5.46-15.44-10.46-22.84-.31-.49-.53-.78-.53-.78,0,0-3.68,6.5-7.65,12.12-3.97,5.62-5.63,15.05,1.37,18.92,0,0-3.78-3.91,1.04-10.78,1.37-1.95,3.49-4.71,5.17-7.38,2.3,3.87,4.03,7.62,3.96,10.56-.19,7.76-4.83,12.67-11.83,12.5-7-.17-11.4-5.29-11.22-13.05.09-3.78,3.2-8.73,6.68-13.56.27-.4.68-.96,1.25-1.71.13-.18.27-.37.41-.55,4.51-6.22,4.57-11.87,4.09-14.99,13.32.49,23.97,11.45,23.97,24.89,0,9.4-5.2,17.57-12.88,21.82M8.93,31.99c0-13.45,10.66-24.41,24-24.89-5,8.97-17.41,20.06-17.66,30.64-.17,7.05,2.41,12.58,6.57,16.09-7.69-4.24-12.91-12.42-12.91-21.83Z" fill="#fff"/>
              </g>
            </mask>
            <mask id="d" x="8.92" y="7.09" width="49.83" height="46.77" maskUnits="userSpaceOnUse">
              <g id="e">
                <path d="M58.75,7.1H8.93v46.72h49.83V7.1Z" fill="#fff"/>
              </g>
            </mask>
          </defs>
          <g mask="url(#b)">
            <g mask="url(#d)">
              <rect x="8.92" y="7.09" width="49.83" height="46.77" fill="#FF6B35"/>
            </g>
          </g>
          <path d="M45.87,53.81c3.92-3.34,6.47-8.53,6.63-15.18.18-7.33-5.46-15.44-10.46-22.84-.31-.49-.53-.78-.53-.78,0,0-3.68,6.5-7.65,12.12-3.97,5.62-5.63,15.05,1.37,18.92,0,0-3.78-3.91,1.04-10.78,1.37-1.95,3.49-4.71,5.17-7.38,2.3,3.87,4.03,7.62,3.96,10.56-.19,7.76-4.83,12.67-11.83,12.5-7-.17-11.4-5.29-11.22-13.05.09-3.78,3.2-8.73,6.68-13.56.27-.4.68-.96,1.25-1.71.13-.18.27-.37.41-.55,4.51-6.22,4.57-11.87,4.09-14.99,13.32.49,23.97,11.45,23.97,24.89,0,9.4-5.2,17.57-12.88,21.82M8.93,31.99c0-13.45,10.66-24.41,24-24.89-5,8.97-17.41,20.06-17.67,30.64-.17,7.05,2.41,12.58,6.57,16.09-7.69-4.24-12.91-12.42-12.91-21.83ZM35.5,0C15.89,0,0,15.89,0,35.5s15.89,35.5,35.5,35.5,35.5-15.89,35.5-35.5S55.11,0,35.5,0Z" fill="#231f20"/>
        </svg>
      </div>
      
      {/* Основной текст */}
      <h3 className="main-title">
        Находится в разработке
      </h3>
      
      {/* Подзаголовок */}
      <p className="subtitle">
        Мы работаем над улучшением чат-бота.<br />
        Скоро он будет доступен!
      </p>
      
      {/* Индикатор загрузки */}
      <div className="loading-dots">
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
      </div>
    </div>
  );
};

// Демонстрация с переключением темы
export const AppDevelopment = () => {
  // Определяем системную тему при инициализации
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };
  
  const [theme, setTheme] = useState(getSystemTheme);
  
  // Отслеживаем изменения системной темы
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  return (
    <div className={`app ${theme}`}>
      <div className="demo-container">
        {/* Переключатель темы для демонстрации */}
        <div className="theme-toggle-container">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="theme-toggle"
          >
            {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
          </button>
        </div>
        
        {/* Заголовок как на сайте */}
        <div className="site-header">
          <h1>Второй Пилот</h1>
        </div>
        
        {/* Баннер разработки */}
        <DevelopmentBanner theme={theme} />
        
        {/* Кнопка "Новый чат" (отключена) */}
        <button 
          disabled
          className="new-chat-button"
        >
          Новый чат
        </button>
      </div>
    </div>
  );
};

export default AppDevelopment;