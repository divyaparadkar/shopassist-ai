export const initialOrders = {
  "ORD-1024": {
    id: "ORD-1024",
    customer: "Alex Morgan",
    date: "2026-10-06 14:30",
    status: "in_transit",
    statusText: "In Transit",
    carrier: "FedEx Express",
    trackingNumber: "FX-948201948",
    estimatedDelivery: "Tomorrow, 5:00 PM",
    shippingAddress: "742 Evergreen Terrace, Springfield, OR",
    items: [
      { name: "Wireless Noise-Canceling Headphones", qty: 1, price: 129.99, image: "🎧" },
      { name: "USB-C Nylon Braided Cable (6ft)", qty: 1, price: 19.99, image: "🔌" }
    ],
    total: 149.98,
    paymentMethod: "Visa ending in 4242",
    canCancel: false,
    cancelReason: "Order has already been shipped and is in transit."
  },
  "ORD-8821": {
    id: "ORD-8821",
    customer: "Jordan Vance",
    date: "2026-10-07 12:15",
    status: "processing",
    statusText: "Processing",
    carrier: "Preparing for Shipment",
    trackingNumber: "Pending",
    estimatedDelivery: "Friday, Oct 10",
    shippingAddress: "100 Tech Boulevard, Austin, TX",
    items: [
      { name: "Ultra-Soft Cotton Hoodie (Navy / L)", qty: 1, price: 59.00, image: "🧥" }
    ],
    total: 59.00,
    paymentMethod: "Apple Pay",
    canCancel: true,
    cancelReason: ""
  },
  "123456": {
    id: "123456",
    customer: "Sam Taylor",
    date: "2026-10-07 13:10",
    status: "processing",
    statusText: "Processing",
    carrier: "Preparing for Shipment",
    trackingNumber: "Pending",
    estimatedDelivery: "Saturday, Oct 11",
    shippingAddress: "456 Market St, San Francisco, CA",
    items: [
      { name: "Ergonomic Mechanical Keyboard (RGB)", qty: 1, price: 119.50, image: "⌨️" }
    ],
    total: 119.50,
    paymentMethod: "PayPal",
    canCancel: true,
    cancelReason: ""
  },
  "ORD-4491": {
    id: "ORD-4491",
    customer: "Taylor Swift",
    date: "2026-10-04 09:00",
    status: "delivered",
    statusText: "Delivered",
    carrier: "UPS Ground",
    trackingNumber: "1Z9999999999999999",
    estimatedDelivery: "Delivered Oct 06 at 2:15 PM",
    shippingAddress: "123 Music Row, Nashville, TN",
    items: [
      { name: "Smart Fitness Watch Series 5", qty: 1, price: 199.00, image: "⌚" }
    ],
    total: 199.00,
    paymentMethod: "MasterCard ending in 8812",
    canCancel: false,
    cancelReason: "Order has already been delivered. You may initiate a return."
  }
};

export const getOrderById = (id, ordersState) => {
  if (!id) return null;
  const cleanId = id.trim().toUpperCase();
  const existing = ordersState[cleanId] || ordersState[cleanId.replace(/^ORD-/, "")];
  if (existing) return existing;

  // Generate dynamic mock order for any other 6-digit or ORD- order ID typed by user!
  const isDigits = /^\d{6}$/.test(cleanId) || /^ORD-\d{4,6}$/.test(cleanId);
  if (isDigits) {
    return {
      id: cleanId,
      customer: "Valued Customer",
      date: "Just now",
      status: "processing",
      statusText: "Processing",
      carrier: "DHL Express",
      trackingNumber: `DHL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: "In 2-3 Business Days",
      shippingAddress: "123 Main Street, Suite 400",
      items: [
        { name: "Premium ShopAssist Tech Bundle", qty: 1, price: 89.99, image: "📦" }
      ],
      total: 89.99,
      paymentMethod: "Credit Card",
      canCancel: true,
      cancelReason: ""
    };
  }

  return null;
};
