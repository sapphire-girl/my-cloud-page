// src/App.js (使用 graphql-request 示例)
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';

// Worker部署后的URL (或者你绑定的自定义域名/api路径)
const WORKER_ENDPOINT = 'https://my-worker.sapphirewhite59.workers.dev'; // 替换成你的Worker URL

const HELLO_QUERY = gql`
  query GetHello {
    hello
  }
`;

const GREET_MUTATION = gql`
  mutation SayGreeting($name: String!) {
    greet(name: $name)
  }
`;
const ASK_AI_QUERY = gql`
  query AskAI($prompt: String!) {
    askAI(prompt: $prompt)
  }
`;

function App() {
  const [helloMessage, setHelloMessage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAskAI = async () => {
    if (!aiPrompt) return;
    setIsLoadingAI(true);
    setAiResponse('');
    try {
      const data = await request(WORKER_ENDPOINT, ASK_AI_QUERY, { prompt: aiPrompt });
      setAiResponse(data.askAI);
    } catch (error) {
      console.error('Error asking AI:', error);
      setAiResponse('Failed to get response from AI.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    request(WORKER_ENDPOINT, HELLO_QUERY)
      .then((data) => setHelloMessage(data.hello))
      .catch((error) => console.error('Error fetching hello:', error));
  }, []);

  const handleGreet = async () => {
    if (!nameInput) return;
    try {
      const data = await request(WORKER_ENDPOINT, GREET_MUTATION, { name: nameInput });
      setGreeting(data.greet);
    } catch (error) {
      console.error('Error sending greeting:', error);
      setGreeting('Failed to greet.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Message from Worker: {helloMessage}</p>
        <div>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleGreet}>Greet Me</button>
          {greeting && <p>Worker says: {greeting}</p>}
        </div>
        <hr />
        <div>
          <h3>Ask the AI</h3>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Enter your prompt for the AI"
            rows={3}
          />
          <button onClick={handleAskAI} disabled={isLoadingAI}>
            {isLoadingAI ? 'Asking AI...' : 'Ask AI'}
          </button>
          {aiResponse && (
            <div>
              <h4>AI Response:</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
            </div>
          )}
        </div>
      </header>

    </div>
  );
}

export default App;