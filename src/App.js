// src/App.js

import React from 'react';
// 修改：导入 NavLink 来处理激活链接的样式
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // 引入我们的样式文件

import AIChat from './components/AIChat';
import CodeReview from './components/CodeReview';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav className="app-nav">
            <ul>
              <li>
                <NavLink
                  to="/aichat"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                  defaultChecked
                >
                  AI聊天
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/codereview"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  代码审查
                </NavLink>
              </li>
             
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/aichat" element={<AIChat />} />
            <Route path="/codereview" element={<CodeReview />} />
            
          </Routes>
        </main>

        <footer className="app-footer">
        </footer>
      </div>
    </Router>
  );
}

export default App;