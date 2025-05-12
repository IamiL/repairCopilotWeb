import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Привет, как дела?', timestamp: '13:31', isOwn: false },
        { id: 2, text: 'Всё отлично! А у тебя?', timestamp: '13:32', isOwn: true },
        { id: 3, text: 'Тоже неплохо. Что планируешь на выходные?', timestamp: '13:33', isOwn: false },
        { id: 4, text: 'Собираюсь погулять в парке, если погода будет хорошей', timestamp: '13:35', isOwn: true },
        { id: 5, text: 'Отличная идея! Может встретимся там?', timestamp: '13:36', isOwn: false },
        { id: 6, text: 'Собираюсь погулять в парке, если погода будет хорошей', timestamp: '13:35', isOwn: true },
        { id: 7, text: 'Отличная идея! Может встретимся там?', timestamp: '13:36', isOwn: false },
        { id: 8, text: 'Собираюсь погулять в парке, если погода будет хорошей', timestamp: '13:35', isOwn: true },
        { id: 9, text: 'Отличная идея! Может встретимся там?', timestamp: '13:36', isOwn: false },
        { id: 10, text: 'Собираюсь погулять в парке, если погода будет хорошей', timestamp: '13:35', isOwn: true },
        { id: 11, text: 'Отличная идея! Может встретимся там?', timestamp: '13:36', isOwn: false },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false); // Состояние для обработки загрузки
    const [error, setError] = useState(null); // Состояние для обработки ошибок
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        setIsSending(true); // Блокируем кнопку отправки
        setError(null); // Сбрасываем ошибку перед началом нового запроса

        try {
            // Отправка POST-запроса
            const response = await axios.post('/api/message', { message: newMessage });

            // Проверяем успешность ответа
            if (response.status === 200) {
                const currentTime = new Date();
                const hours = currentTime.getHours().toString().padStart(2, '0');
                const minutes = currentTime.getMinutes().toString().padStart(2, '0');

                const newMsg = {
                    id: messages.length + 1,
                    text: newMessage,
                    timestamp: `${hours}:${minutes}`,
                    isOwn: true
                };

                setMessages((prevMessages) => [...prevMessages, newMsg]); // Добавляем сообщение в список
                setNewMessage(''); // Очищаем поле ввода
            }
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
            setError('Сервер недоступен'); // Устанавливаем сообщение об ошибке
        } finally {
            setIsSending(false); // Разблокируем кнопку
        }
    };


    return (
        <div className="chat-container">
            <div className="messages-container" ref={messagesEndRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
                    >
                        <div className="message-content">
                            <p>{message.text}</p>
                            <span className="timestamp">{message.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Показываем уведомление об ошибке */}
            {error && <div className="error-notification">{error}</div>}

            <form className="message-input-container" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                    disabled={isSending} // Отключаем ввод, если идет запрос
                />
                <button type="submit" className="send-button" disabled={isSending}>
                    <svg className="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Chat;
