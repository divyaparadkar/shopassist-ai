import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatView from './components/ChatView';
import StudioView from './components/StudioView';
import OrdersSandboxView from './components/OrdersSandboxView';
import AnalyticsView from './components/AnalyticsView';
import initialIntentsData from './data/intentsData.json';
import { initialOrders } from './data/mockOrders';
import { soundFx } from './utils/audioEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [intents, setIntents] = useState(initialIntentsData.intents);
  const [orders, setOrders] = useState(initialOrders);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify({ intents }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intents.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`app-root theme-${theme}`}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={setTheme}
        onExportJson={handleExportJson}
      />

      <main className="main-viewport">
        {activeTab === 'chat' && (
          <ChatView intents={intents} orders={orders} setOrders={setOrders} />
        )}

        {activeTab === 'studio' && (
          <StudioView intents={intents} setIntents={setIntents} onExportJson={handleExportJson} />
        )}

        {activeTab === 'orders' && (
          <OrdersSandboxView orders={orders} setOrders={setOrders} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView intents={intents} />
        )}
      </main>
    </div>
  );
}
