import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Database, 
  Package, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Download, 
  Moon, 
  Sun,
  ShieldCheck,
  Clock,
  Code2
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  soundEnabled, 
  setSoundEnabled, 
  theme, 
  setTheme,
  onExportJson
}) {
  const isStoreOpen = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sun, 6 is Sat
    const hour = now.getHours(); // 0 to 23
    return day >= 1 && day <= 5 && hour >= 8 && hour < 20;
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-icon-bg">
            <Sparkles size={24} className="logo-icon" />
          </div>
          <div className="logo-text">
            <span className="logo-title">ShopAssist <span className="badge-ai">AI 2.0 ✨</span></span>
            <span className="logo-subtitle">Pink Edition NLP Assistant & Studio</span>
          </div>
        </div>

        <div className="live-status-pill">
          <span className={`status-dot ${isStoreOpen() ? 'online' : 'after-hours'}`}></span>
          <span className="status-text">
            {isStoreOpen() ? 'Live Support Online' : 'Digital Store 24/7 (Live Agent Mon-Fri 8am-8pm)'}
          </span>
        </div>
      </div>

      <nav className="header-nav">
        <button 
          className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <Bot size={18} />
          <span>💬 ShopBot Chat</span>
        </button>

        <button 
          className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <Database size={18} />
          <span>⚙️ Intent Studio</span>
        </button>

        <button 
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={18} />
          <span>📦 Orders Sandbox</span>
        </button>

        <button 
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>📊 NLP Metrics</span>
        </button>
      </nav>

      <div className="header-actions">
        <a 
          href="https://github.com/divyaparadkar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary flex-center-gap"
          title="Visit Divya Paradkar's GitHub Profile"
          style={{ textDecoration: 'none' }}
        >
          <Code2 size={16} />
          <span>divyaparadkar</span>
        </a>

        <button 
          className="action-icon-btn" 
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="muted" />}
        </button>

        <button 
          className="action-icon-btn" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button 
          className="btn-secondary flex-center-gap"
          onClick={onExportJson}
          title="Export updated intents.json"
        >
          <Download size={16} />
          <span>intents.json</span>
        </button>
      </div>
    </header>
  );
}
