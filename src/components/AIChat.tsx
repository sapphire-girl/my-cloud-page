import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f9f9f9;
`;

const MessageBubble  = styled.div<{ isUser: boolean }>`
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? '#007bff' : '#e9e9eb')};
  color: ${(props) => (props.isUser ? '#fff' : '#333')};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid #ccc;
  background-color: #fff;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 16px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

interface MessageType  {
  text: string;
  isUser: boolean;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<MessageType []>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const workerUrl = 'https://my-cloud-worker.sapphirewhite59.workers.dev';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newUserMessage: MessageType  = { text: input, isUser: true };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInput('');

      try {
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response from worker:', data);
        const aiMessage: MessageType  = { text: data.reply || 'Error: No response from AI', isUser: false };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error sending message to worker:', error);
        const errorMessage: MessageType  = { text: 'Error: Could not connect to AI.', isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble  key={index} isUser={msg.isUser}>
            {msg.text}
          </MessageBubble >
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." />
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default AIChat;