import React, { useState } from 'react';
import { Package, Plus, Trash2, Truck, RefreshCw, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import OrderCard from './OrderCard';

export default function OrdersSandboxView({ orders, setOrders }) {
  const [selectedOrderId, setSelectedOrderId] = useState(Object.keys(orders)[0] || 'ORD-1024');
  const [newOrderId, setNewOrderId] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newTotal, setNewTotal] = useState('89.99');
  const [newStatus, setNewStatus] = useState('processing');
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  const activeOrder = orders[selectedOrderId] || Object.values(orders)[0];

  const handleUpdateStatus = (id, newStatusVal) => {
    setOrders(prev => {
      const target = prev[id];
      if (!target) return prev;

      let statusText = 'Processing';
      let canCancel = true;

      if (newStatusVal === 'in_transit') {
        statusText = 'In Transit';
        canCancel = false;
      } else if (newStatusVal === 'delivered') {
        statusText = 'Delivered';
        canCancel = false;
      } else if (newStatusVal === 'canceled') {
        statusText = 'Canceled';
        canCancel = false;
      }

      return {
        ...prev,
        [id]: {
          ...target,
          status: newStatusVal,
          statusText,
          canCancel,
          cancelReason: !canCancel && newStatusVal !== 'canceled' ? 'Order has already shipped.' : target.cancelReason
        }
      };
    });
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const id = newOrderId.trim().toUpperCase() || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newObj = {
      id,
      customer: newCustomer.trim() || 'John Doe',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: newStatus,
      statusText: newStatus === 'processing' ? 'Processing' : newStatus === 'in_transit' ? 'In Transit' : 'Delivered',
      carrier: newStatus === 'in_transit' ? 'FedEx Express' : 'Pending',
      trackingNumber: `FX-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: 'In 2-4 Days',
      shippingAddress: '456 Tech Park Way, Suite 100',
      items: [
        { name: 'ShopAssist Sample Item', qty: 1, price: parseFloat(newTotal) || 89.99, image: '🎁' }
      ],
      total: parseFloat(newTotal) || 89.99,
      paymentMethod: 'Visa ending in 1122',
      canCancel: newStatus === 'processing'
    };

    setOrders(prev => ({ ...prev, [id]: newObj }));
    setSelectedOrderId(id);
    setShowAddOrderModal(false);
    setNewOrderId('');
    setNewCustomer('');
  };

  return (
    <div className="sandbox-container">
      {/* Sidebar list of mock orders */}
      <div className="sandbox-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>Orders Database ({Object.keys(orders).length})</h3>
          <button 
            className="btn-primary-sm flex-center-gap"
            onClick={() => setShowAddOrderModal(true)}
          >
            <Plus size={14} /> New Order
          </button>
        </div>

        <div className="orders-list">
          {Object.values(orders).map(ord => (
            <div 
              key={ord.id}
              className={`order-list-item ${selectedOrderId === ord.id ? 'active' : ''}`}
              onClick={() => setSelectedOrderId(ord.id)}
            >
              <div className="ord-item-top flex-center-gap">
                <Package size={16} className="accent-icon" />
                <span className="ord-id-label">#{ord.id}</span>
                <span className={`status-pill ${ord.status}`}>{ord.statusText}</span>
              </div>
              <div className="ord-item-sub">
                <span>{ord.customer}</span>
                <strong>${ord.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Order View & Status Switcher */}
      <div className="sandbox-main glass-panel">
        {activeOrder ? (
          <div>
            <div className="sandbox-main-header">
              <div>
                <h2>Order Sandbox Inspector: <span className="accent-text" style={{ color: '#ec4899' }}>#{activeOrder.id}</span></h2>
                <p style={{ color: '#d8b4fe', fontSize: '0.85rem' }}>💡 Easy Simulator: Click any status button on the right to instantly test tracking or cancellation responses in ShopBot Chat.</p>
              </div>

              <div className="status-changer flex-center-gap">
                <span className="label">Simulate Status:</span>
                <button 
                  className={`btn-status ${activeOrder.status === 'processing' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(activeOrder.id, 'processing')}
                >
                  <Clock size={14} /> Processing
                </button>
                <button 
                  className={`btn-status ${activeOrder.status === 'in_transit' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(activeOrder.id, 'in_transit')}
                >
                  <Truck size={14} /> In Transit
                </button>
                <button 
                  className={`btn-status ${activeOrder.status === 'delivered' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(activeOrder.id, 'delivered')}
                >
                  <CheckCircle2 size={14} /> Delivered
                </button>
                <button 
                  className={`btn-status ${activeOrder.status === 'canceled' ? 'active' : ''}`}
                  onClick={() => handleUpdateStatus(activeOrder.id, 'canceled')}
                >
                  <XCircle size={14} /> Canceled
                </button>
              </div>
            </div>

            <OrderCard 
              order={activeOrder} 
              onCancelOrder={(id) => handleUpdateStatus(id, 'canceled')}
            />
          </div>
        ) : (
          <div>Select an order to inspect.</div>
        )}
      </div>

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="modal-backdrop">
          <div className="modal-card glass-panel">
            <div className="modal-header">
              <h3>Add Test Order</h3>
              <button className="close-btn" onClick={() => setShowAddOrderModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="form-group">
                <label>Order ID (e.g. ORD-9988 or 654321):</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="ORD-9988"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Customer Name:</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Jane Smith"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Total Amount ($):</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Initial Status:</label>
                <select 
                  className="input-field"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="processing">Processing (Eligible for instant cancellation)</option>
                  <option value="in_transit">In Transit (Shipped)</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
