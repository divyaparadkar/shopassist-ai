import React from 'react';
import { Package, Truck, CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderCard({ order, onCancelOrder }) {
  if (!order) return null;

  const handleCancelClick = () => {
    if (onCancelOrder) {
      onCancelOrder(order.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_transit':
        return <span className="order-badge blue"><Truck size={14} /> In Transit</span>;
      case 'processing':
        return <span className="order-badge amber"><Clock size={14} /> Processing</span>;
      case 'delivered':
        return <span className="order-badge green"><CheckCircle2 size={14} /> Delivered</span>;
      case 'canceled':
        return <span className="order-badge red"><XCircle size={14} /> Canceled</span>;
      default:
        return <span className="order-badge gray">{status}</span>;
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Placed', done: true },
    { key: 'processing', label: 'Processing', done: ['processing', 'in_transit', 'delivered'].includes(order.status) },
    { key: 'in_transit', label: 'In Transit', done: ['in_transit', 'delivered'].includes(order.status) },
    { key: 'delivered', label: 'Delivered', done: order.status === 'delivered' }
  ];

  const isCanceled = order.status === 'canceled';

  return (
    <div className="order-details-card glass-panel">
      <div className="order-card-header">
        <div>
          <div className="order-id-title flex-center-gap">
            <Package size={18} className="accent-icon" />
            <span>Order #{order.id}</span>
          </div>
          <span className="order-date">Placed on {order.date}</span>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {!isCanceled && (
        <div className="order-timeline">
          {steps.map((step, idx) => (
            <div key={step.key} className={`timeline-step ${step.done ? 'completed' : ''}`}>
              <div className="step-node">
                {step.done ? <CheckCircle2 size={12} /> : idx + 1}
              </div>
              <span className="step-label">{step.label}</span>
              {idx < steps.length - 1 && <div className={`step-line ${step.done && steps[idx+1].done ? 'completed' : ''}`}></div>}
            </div>
          ))}
        </div>
      )}

      {isCanceled && (
        <div className="cancellation-alert red">
          <XCircle size={18} />
          <div>
            <strong>This order has been canceled</strong>
            <p>Refund of ${order.total.toFixed(2)} has been processed to your payment method ({order.paymentMethod}).</p>
          </div>
        </div>
      )}

      <div className="order-info-grid">
        <div className="info-block">
          <span className="info-label">Carrier & Tracking</span>
          <span className="info-value">{order.carrier}</span>
          <span className="info-sub">{order.trackingNumber}</span>
        </div>

        <div className="info-block">
          <span className="info-label">Est. Delivery</span>
          <span className="info-value accent-text">{order.estimatedDelivery}</span>
        </div>

        <div className="info-block">
          <span className="info-label">Ship To</span>
          <span className="info-value truncate">{order.shippingAddress}</span>
        </div>
      </div>

      <div className="order-items-list">
        <span className="info-label">Order Summary ({order.items.length} item{order.items.length > 1 ? 's' : ''})</span>
        {order.items.map((item, idx) => (
          <div key={idx} className="item-row">
            <span className="item-emoji">{item.image}</span>
            <div className="item-meta">
              <span className="item-name">{item.name}</span>
              <span className="item-qty">Qty: {item.qty}</span>
            </div>
            <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}

        <div className="order-total-row">
          <span>Total Paid</span>
          <span className="total-amount">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-card-actions">
        {order.canCancel && !isCanceled && (
          <button 
            className="btn-danger-outline full-width flex-center-gap"
            onClick={handleCancelClick}
          >
            <XCircle size={16} />
            <span>Request Instant Order Cancellation</span>
          </button>
        )}

        {!order.canCancel && !isCanceled && order.cancelReason && (
          <div className="cancel-ineligible-note">
            <AlertCircle size={14} />
            <span>{order.cancelReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}
