import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  Tag, 
  HelpCircle,
  Bot,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import OrderCard from './OrderCard';
import { PaymentMethodsWidget, StoreHoursWidget, ShippingWidget, HumanEscalationWidget } from './Widgets';
import { classifyIntent, extractOrderId } from '../utils/nlpEngine';
import { soundFx } from '../utils/audioEffects';

export default function ChatView({ intents, orders, setOrders }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to ShopAssist Support. How can I help you today?",
      intent: 'greeting',
      confidence: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentContext, setCurrentContext] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    soundFx.playSend();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot NLP classification delay
    setTimeout(() => {
      const result = classifyIntent(query, intents, currentContext);
      soundFx.playReceive();

      // Check order details if orderId detected or lookup requested
      let matchedOrder = null;
      if (result.orderId) {
        matchedOrder = orders[result.orderId];
        if (!matchedOrder && result.orderId.length >= 6) {
          // Fallback mock order creator for testing
          matchedOrder = {
            id: result.orderId,
            customer: "Guest User",
            date: "Recent",
            status: "processing",
            statusText: "Processing",
            carrier: "Standard Parcel",
            trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
            estimatedDelivery: "In 3 Business Days",
            shippingAddress: "100 Main Street, Cityville",
            items: [{ name: "ShopAssist Order Item", qty: 1, price: 49.99, image: "📦" }],
            total: 49.99,
            paymentMethod: "Credit Card",
            canCancel: true
          };
        }
      }

      let botResponseText = result.response;
      if (result.intent === 'order_status' && matchedOrder) {
        botResponseText = `Here are the latest details for Order #${matchedOrder.id}:`;
      } else if (result.intent === 'cancel_order' && matchedOrder) {
        if (matchedOrder.canCancel && matchedOrder.status !== 'canceled') {
          botResponseText = `Order #${matchedOrder.id} is currently processing and eligible for instant cancellation:`;
        } else if (matchedOrder.status === 'canceled') {
          botResponseText = `Order #${matchedOrder.id} has already been canceled.`;
        } else {
          botResponseText = `Order #${matchedOrder.id} cannot be canceled directly because it has already shipped (${matchedOrder.statusText}).`;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        intent: result.intent,
        confidence: result.confidence,
        context_set: result.context_set,
        orderData: matchedOrder,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setCurrentContext(result.context_set || '');
      setIsTyping(false);
    }, 600);
  };

  const handleCancelOrderAction = (orderId) => {
    setOrders(prev => {
      const existing = prev[orderId];
      if (!existing) return prev;
      return {
        ...prev,
        [orderId]: {
          ...existing,
          status: 'canceled',
          statusText: 'Canceled',
          canCancel: false,
          cancelReason: 'Order was canceled by customer via ShopAssist Bot.'
        }
      };
    });

    soundFx.playSuccess();

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: `✅ Success! Order #${orderId} has been canceled. Your refund of $${orders[orderId]?.total.toFixed(2) || '0.00'} has been initiated.`,
        intent: 'cancel_order',
        confidence: 1.0,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPrompts = [
    { label: "📍 Track Order #ORD-1024", prompt: "Where is my order ORD-1024?" },
    { label: "❌ Cancel Order #ORD-8821", prompt: "Cancel my order ORD-8821" },
    { label: "📦 Return Policy", prompt: "How do I return an item?" },
    { label: "💳 Payment Methods", prompt: "What payment options do you accept?" },
    { label: "🕒 Support Hours", prompt: "When are you open?" },
    { label: "🚚 Shipping Costs", prompt: "How much is shipping?" },
    { label: "👩‍💼 Live Representative", prompt: "I want to speak to a real person" }
  ];

  return (
    <div className="chat-container">
      {/* Easy Assistant Quick Guide Banner */}
      <div className="chat-status-bar">
        <div className="context-indicator flex-center-gap">
          <Sparkles size={16} style={{ color: '#ec4899' }} />
          <span>Active Context: <strong style={{ color: '#f472b6' }}>{currentContext || 'Ready (Standard NLP State)'}</strong></span>
        </div>
        <div className="flex-center-gap">
          <span style={{ fontSize: '0.75rem', color: '#d8b4fe' }}>💡 Tip: Click any quick button below to test instantly!</span>
          <button 
            className="btn-text-sm flex-center-gap" 
            onClick={() => { setMessages([]); setCurrentContext(''); }}
            style={{ marginLeft: '1rem' }}
          >
            <RotateCcw size={14} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>

            <div className="message-content">
              <div className="message-header flex-center-gap">
                <span className="sender-name">{msg.sender === 'bot' ? 'ShopBot' : 'You'}</span>
                <span className="timestamp">{msg.timestamp}</span>

                {msg.sender === 'bot' && msg.intent && (
                  <span className="intent-badge">
                    <Tag size={10} />
                    <span>{msg.intent}</span>
                    <span className="confidence-pill">{Math.round(msg.confidence * 100)}% match</span>
                  </span>
                )}
              </div>

              <div className="message-bubble">
                <p>{msg.text}</p>

                {/* Render order card if intent matches order_status / cancel_order and order lookup present */}
                {msg.sender === 'bot' && msg.orderData && (
                  <OrderCard order={msg.orderData} onCancelOrder={handleCancelOrderAction} />
                )}

                {/* Render visual widgets based on intent tag */}
                {msg.sender === 'bot' && msg.intent === 'payment_methods' && <PaymentMethodsWidget />}
                {msg.sender === 'bot' && msg.intent === 'store_hours' && <StoreHoursWidget />}
                {msg.sender === 'bot' && msg.intent === 'shipping_policy' && <ShippingWidget />}
                {msg.sender === 'bot' && msg.intent === 'human_agent' && <HumanEscalationWidget />}
              </div>

              {msg.sender === 'bot' && (
                <button 
                  className="speech-btn" 
                  onClick={() => speakText(msg.text)}
                  title="Read message aloud"
                >
                  <Volume2 size={14} /> Read Aloud
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row bot">
            <div className="avatar"><Bot size={20} /></div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
                <span className="typing-label">ShopBot is evaluating intents...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Pills */}
      <div className="quick-prompts-bar">
        <span className="quick-label flex-center-gap"><HelpCircle size={14} /> Try asking:</span>
        <div className="quick-pills-scroll">
          {quickPrompts.map((item, idx) => (
            <button 
              key={idx} 
              className="quick-pill"
              onClick={() => handleSend(item.prompt)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <input 
            type="text"
            className="chat-input"
            placeholder="Ask ShopBot anything (e.g. Where is my order ORD-1024?, refund policy, payment methods)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <button 
            className={`icon-btn mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceInput}
            title={isListening ? "Listening... click to stop" : "Voice input"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button 
            className="btn-primary send-btn flex-center-gap"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
