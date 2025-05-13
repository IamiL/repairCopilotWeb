import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]); // Хранение сообщений
    const [inputMessage, setInputMessage] = useState(''); // Текст сообщения
    const [isChatEnded, setIsChatEnded] = useState(false); // Флаг завершения чата

    const [newMessage, setNewMessage] = useState(''); // Для ввода сообщения
    const [isSending, setIsSending] = useState(false); // Отслеживание отправки сообщения
    const [isLoading, setIsLoading] = useState(true); // Загрузка данных из API
    const [error, setError] = useState(null); // Для обработки ошибок
    const messagesEndRef = useRef(null); // Для автоматической прокрутки к последнему сообщению

    // Прокрутка чата к последнему сообщению
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Загрузка сообщений при первом рендере
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true); // Включаем индикатор загрузки
                const response = await axios.get('/api/message'); // GET-запрос к серверу

                if (response.status === 200) {
                    console.log('пришёл ответ от сервера с сообщениями: ', response.data.messages)
                    const data = response.data.messages;

                    // Проверка, что пришли сообщения в виде массива
                    if (Array.isArray(data)) {
                        const formattedMessages = data.map((message) => {
                            const originalDate = new Date(message.time); // Парсим дату
                            const hours = originalDate.getHours().toString().padStart(2, '0'); // Часы
                            const minutes = originalDate.getMinutes().toString().padStart(2, '0'); // Минуты

                            return {
                                ...message,
                                time: `${hours}:${minutes}`, // Добавляем поле времени
                            };
                        });

                        setMessages(formattedMessages);
                        // Сохраняем сообщения в state
                    } else {
                        throw new Error('Ответ сервера не является массивом');
                    }
                } else {
                    console.log('выбрасываем ошибку статус не 200')
                    throw new Error(`Ошибка загрузки (код ${response.status})`);
                }
            } catch (err) {
                setError('Не удалось загрузить сообщения. Попробуйте снова.');
                console.error(err);
                console.log('выбрасываем ошибку - ', err.message, err)
            } finally {
                setIsLoading(false); // Выключаем индикатор загрузки
            }
        };

        fetchMessages();
    }, []);

    // Эффект для автопрокрутки после обновления сообщений
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleEndChat = async () => {
        // Блокируем ввод и кнопку для отправки сообщений
        setMessages([...messages, { id: Date.now(), body: 'Завершить диалог', isBot: false }]);
        setIsChatEnded(true);


        setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), body: "Составляю сводку диалога...", isBot: true },
        ]);

        const container = document.getElementById('message-input-container');
        if (container) {
            container.parentNode.removeChild(container);
        } else {
            console.warn("Элемент с id 'message-input-container' не найден.");
        }

        try {
            // DELETE запрос
            const response = await axios.delete('/api/chat');
            if (response.status === 200) {
                const botReply = response.data.body || 'Чат завершён.';
                // setMessages((prevMessages) => [
                //     ...prevMessages,
                //     { id: Date.now(), body: botReply, isBot: true },
                // ]);
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    if (updatedMessages.length > 0) {
                        updatedMessages[updatedMessages.length - 1] = {
                            ...updatedMessages[updatedMessages.length - 1], // Сохраняем все существующие поля последнего сообщения
                            body: botReply, // Обновляем текст последнего сообщения
                        };
                    }
                    return updatedMessages; // Возвращаем обновлённый массив
                });
            }
        } catch (error) {
            console.error('Ошибка при завершении чата:', error);
        }
    };


    // Обработка события "Новый чат"
    const handleNewChat = async () => {
        setMessages([]);
        setIsChatEnded(false);
        setInputMessage('');

        try {
            setIsLoading(true); // Отображаем индикатор загрузки
            setError(null); // Сбрасываем прошлые ошибки

            const response = await axios.post('/api/chat'); // Отправляем запрос на создание нового чата

            if (response.status === 200) {
                const { resp } = response.data; // Извлекаем поле `resp` из ответа
                const currentTime = new Date();
                const hours = currentTime.getHours().toString().padStart(2, '0');
                const minutes = currentTime.getMinutes().toString().padStart(2, '0');

                // Добавляем сообщение от бота
                const firstMessage = {
                    id: messages.length + 1, // Уникальный ID
                    body: resp, // Текст сообщения
                    time: `${hours}:${minutes}`, // Текущее время
                    isBot: true, // Сообщение от бота
                };

                setMessages([firstMessage]); // Заменяем текущие сообщения на новое первое сообщение
            } else {
                throw new Error(`Ошибка создания чата: код ${response.status}`);
            }
        } catch (err) {
            setError(`Ошибка создания нового чата: ${err.message}`); // Отображаем ошибку
        } finally {
            setIsLoading(false); // Убираем индикатор загрузки
        }
    };

    // Отправка нового сообщения
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        setIsSending(true); // Блокируем кнопку отправки
        setError(null); // Очищаем ошибку

        const currentTime = new Date();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');

        const newMsg = {
            id: messages.length + 1,
            body: newMessage,
            time: `${hours}:${minutes}`,
            isBot: false,
        };

        setMessages((prevMessages) => [...prevMessages, newMsg]); // Добавляем сообщение в конец массива

        const newRespMsg = {
            id: messages.length + 1,
            body: "Обработка",
            time: `${hours}:${minutes}`,
            isBot: true,
        };

        setMessages((prevMessages) => [...prevMessages, newRespMsg]); // Добавляем сообщение в конец массива
        setNewMessage(''); // Очищаем поле ввода

        try {
            const response = await axios.post('/api/message', { message: newMessage });
            if (response.status === 200) {
                console.log('запрос на отправку сообщения успешен, ответ response.data.body: ', response.data.body)
                    if (response.data.body.length < 2) {
                        const newMsg = {
                            id: messages.length + 1,
                            body: "Я вас не понял, уточните вопрос.",
                            time: `${hours}:${minutes}`,
                            isBot: true,
                        }

                        setMessages((prevMessages) => [...prevMessages, newMsg]); // Добавляем сообщение в конец массива
                    } else {
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            if (updatedMessages.length > 0) {
                                updatedMessages[updatedMessages.length - 1] = {
                                    ...updatedMessages[updatedMessages.length - 1], // Сохраняем все существующие поля последнего сообщения
                                    body: response.data.body, // Обновляем текст последнего сообщения
                                };
                            }
                            return updatedMessages; // Возвращаем обновлённый массив
                        });
                    }
            } else {
                throw new Error('Ошибка при отправке сообщения');
            }
        } catch (err) {
            setError('Не удалось отправить сообщение. Проверьте подключение.');
        } finally {
            setIsSending(false); // Разблокируем кнопку
        }
    };

    return (
        <div className="chat-container">
            {/* Отображаем индикатор загрузки */}
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : error ? (
                // Отображаем ошибку и кнопку создания нового чата
                <div className="error-container">
                    {/*<p>{error}</p>*/}
                    <button onClick={handleNewChat} className="retry-button new-chat-button">
                        Новый чат
                    </button>
                </div>
            ) : (
                <>
                    {/* Отображение сообщений */}
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.isBot ? 'bot-message' : 'user-message'} ${message.isBot ? 'other-message' : 'own-message'}`}
                            >
                                <div className="message-content">
                                    <div dangerouslySetInnerHTML={{ __html: message.body }} />
                                    <span className="timestamp">{message.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {isChatEnded && (
                        <div className="new-chat-button-container">
                            <button className="new-chat-button" onClick={handleNewChat}>
                                Новый чат
                            </button>
                        </div>
                    )}
                    {messages.length > 0 && !isChatEnded && (
                        <div className="end-chat-button-container">
                            <button className="end-chat-button" onClick={handleEndChat}>
                                Завершить чат
                            </button>
                        </div>
                    )}
                    {/* Поле ввода сообщения */}
                    <form className="message-input-container" onSubmit={handleSendMessage} id='message-input-container'>
                        <input
                            type="text"
                            className="message-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                            disabled={isSending || isChatEnded}
                        />
                        <button type="submit" className="send-button" disabled={isSending}>
                            <svg className="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Chat;