import React, { useState } from 'react';
import { CreditCard, Clock, UserCheck, Truck, ShieldAlert, CheckCircle, ArrowRight, PhoneCall, Mail } from 'lucide-react';

export function PaymentMethodsWidget() {
  const methods = [
    { name: "Visa", icon: "💳", status: "Accepted" },
    { name: "MasterCard", icon: "💳", status: "Accepted" },
    { name: "American Express", icon: "💳", status: "Accepted" },
    { name: "PayPal", icon: "🅿️", status: "Accepted" },
    { name: "Apple Pay", icon: "🍎", status: "Accepted" }
  ];

  return (
    <div className="widget-card glass-panel">
      <div className="widget-header flex-center-gap">
        <CreditCard size={18} className="accent-icon" />
        <span className="widget-title">Accepted Payment Options</span>
      </div>
      <div className="methods-grid">
        {methods.map((m, i) => (
          <div key={i} className="method-chip">
            <span className="method-icon">{m.icon}</span>
            <span className="method-name">{m.name}</span>
            <CheckCircle size={14} className="green-icon" />
          </div>
        ))}
      </div>
      <p className="widget-footer-text">🔒 256-bit Encrypted Secure Checkout</p>
    </div>
  );
}

export function StoreHoursWidget() {
  const schedule = [
    { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM EST", status: "Live Customer Support" },
    { day: "Saturday - Sunday", hours: "Digital Bot 24/7", status: "Automated Tracking & Returns" }
  ];

  return (
    <div className="widget-card glass-panel">
      <div className="widget-header flex-center-gap">
        <Clock size={18} className="accent-icon" />
        <span className="widget-title">ShopAssist Support Hours</span>
      </div>
      <div className="schedule-list">
        {schedule.map((item, idx) => (
          <div key={idx} className="schedule-row">
            <div>
              <strong>{item.day}</strong>
              <div className="schedule-sub">{item.status}</div>
            </div>
            <span className="schedule-hours">{item.hours}</span>
          </div>
        ))}
      </div>
      <div className="widget-banner info">
        🤖 ShopBot AI assistant is online 24/7/365 to handle your order lookups!
      </div>
    </div>
  );
}

export function ShippingWidget() {
  const tiers = [
    { title: "Standard Delivery", price: "$4.99", time: "3-5 Business Days", condition: "Standard items" },
    { title: "Free Shipping", price: "FREE ($0)", time: "3-5 Business Days", condition: "Orders over $50.00" },
    { title: "Expedited Express", price: "$12.99", time: "1-2 Business Days", condition: "Priority handling" }
  ];

  return (
    <div className="widget-card glass-panel">
      <div className="widget-header flex-center-gap">
        <Truck size={18} className="accent-icon" />
        <span className="widget-title">Shipping Policy & Rates</span>
      </div>
      <div className="shipping-tiers">
        {tiers.map((t, idx) => (
          <div key={idx} className="shipping-tier-card">
            <div className="tier-header">
              <span className="tier-title">{t.title}</span>
              <span className="tier-price">{t.price}</span>
            </div>
            <span className="tier-time">⏱️ {t.time}</span>
            <span className="tier-sub">{t.condition}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HumanEscalationWidget() {
  const [transferred, setTransferred] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleConnect = () => {
    setTransferred(true);
    setTicketId(`TICK-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="widget-card glass-panel">
      <div className="widget-header flex-center-gap">
        <UserCheck size={18} className="accent-icon" />
        <span className="widget-title">Human Representative Escalation</span>
      </div>

      {!transferred ? (
        <div className="escalation-body">
          <div className="agent-avatar-preview">
            <div className="agent-avatar">👩‍💼</div>
            <div>
              <strong>Live Agent Routing Queue</strong>
              <p className="agent-sub">Est. Wait: &lt; 2 minutes (Mon-Fri 8am-8pm EST)</p>
            </div>
          </div>
          <button 
            className="btn-primary full-width flex-center-gap"
            onClick={handleConnect}
          >
            <PhoneCall size={16} />
            <span>Connect to Live Support Specialist</span>
          </button>
        </div>
      ) : (
        <div className="escalation-success">
          <div className="success-badge">
            <CheckCircle size={20} />
            <span>Ticket Created: <strong>{ticketId}</strong></span>
          </div>
          <p>An agent (Sarah M.) has been notified. Check your email or stay in this window.</p>
          <div className="contact-direct flex-center-gap">
            <Mail size={14} />
            <span>Direct Support Email: support@example.com</span>
          </div>
        </div>
      )}
    </div>
  );
}
