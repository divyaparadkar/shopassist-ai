import streamlit as st
import json
import re
import random
import time
from datetime import datetime

# ==============================================================================
# Page Configuration & Page Setup
# ==============================================================================
st.set_page_config(
    page_title="ShopAssist AI 2.0 - Streamlit Pink Edition",
    page_icon="💖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS Theme: Radiant Pink & Amethyst Purple Neon Glassmorphism
st.markdown("""
<style>
    /* Main Background & Font */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    html, body, [data-testid="stAppViewContainer"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background-color: #0f071a !important;
        background-image: 
            radial-gradient(circle at 12% 15%, rgba(236, 72, 153, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 88% 85%, rgba(168, 85, 247, 0.22) 0%, transparent 45%),
            radial-gradient(circle at 50% 40%, rgba(217, 70, 239, 0.12) 0%, transparent 55%) !important;
        background-attachment: fixed !important;
        color: #fcf6ff !important;
    }

    [data-testid="stHeader"] {
        background: transparent !important;
    }

    [data-testid="stSidebar"] {
        background: rgba(23, 11, 40, 0.85) !important;
        backdrop-filter: blur(16px);
        border-right: 1px solid rgba(244, 114, 182, 0.2);
    }

    /* Glass Panel Cards */
    .glass-card {
        background: rgba(28, 14, 48, 0.78);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(244, 114, 182, 0.2);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 12px 35px -10px rgba(15, 7, 26, 0.7);
        margin-bottom: 16px;
    }

    .pink-glow-border {
        border-color: #ec4899 !important;
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.35) !important;
    }

    /* Badges & Pill Styling */
    .badge-pink {
        background: linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%);
        color: white;
        padding: 3px 10px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.75rem;
        display: inline-block;
    }

    .intent-pill {
        background: rgba(236, 72, 153, 0.18);
        border: 1px solid rgba(236, 72, 153, 0.35);
        color: #f472b6;
        padding: 2px 8px;
        border-radius: 9999px;
        font-size: 0.72rem;
        font-weight: 600;
    }

    /* Status Badges */
    .status-badge {
        padding: 4px 12px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 0.78rem;
    }
    .status-processing { background: rgba(245, 158, 11, 0.25); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
    .status-in_transit { background: rgba(59, 130, 246, 0.25); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .status-delivered { background: rgba(16, 185, 129, 0.25); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .status-canceled { background: rgba(244, 63, 94, 0.25); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.4); }

    /* Buttons Override */
    .stButton > button {
        background: linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        font-weight: 700 !important;
        padding: 8px 16px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4) !important;
    }

    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 22px rgba(236, 72, 153, 0.6) !important;
        opacity: 0.95 !important;
    }

    /* Streamlit Tabs Customization */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background: rgba(23, 11, 40, 0.6);
        padding: 6px;
        border-radius: 14px;
        border: 1px solid rgba(244, 114, 182, 0.2);
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 10px;
        color: #d8b4fe !important;
        font-weight: 600;
        padding: 8px 16px;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%) !important;
        color: white !important;
        font-weight: 700;
        box-shadow: 0 4px 18px rgba(236, 72, 153, 0.45);
    }

    /* Inputs Styling */
    .stTextInput input, .stTextArea textarea, .stSelectbox select {
        background: rgba(0, 0, 0, 0.35) !important;
        border: 1px solid rgba(244, 114, 182, 0.25) !important;
        color: #fcf6ff !important;
        border-radius: 10px !important;
    }

    .stTextInput input:focus, .stTextArea textarea:focus {
        border-color: #ec4899 !important;
        box-shadow: 0 0 15px rgba(236, 72, 153, 0.4) !important;
    }

    /* Metrics Styling */
    [data-testid="stMetricValue"] {
        color: #ec4899 !important;
        font-weight: 800 !important;
    }

    /* Chat Messages styling */
    [data-testid="stChatMessage"] {
        background: rgba(28, 14, 48, 0.65) !important;
        border: 1px solid rgba(244, 114, 182, 0.15) !important;
        border-radius: 14px !important;
        margin-bottom: 10px !important;
    }

</style>
""", unsafe_allow_html=True)

# ==============================================================================
# Authentication & Streamlit Login System
# ==============================================================================
USERS = {
    "divya": {"password": "pink123", "name": "Divya Paradkar", "role": "Lead Developer & Owner", "avatar": "👩‍💻", "github": "https://github.com/divyaparadkar"},
    "admin": {"password": "admin123", "name": "System Administrator", "role": "Admin", "avatar": "⚡", "github": "https://github.com/divyaparadkar"},
    "demo": {"password": "demo123", "name": "Guest Support Tester", "role": "Tester", "avatar": "💖", "github": "https://github.com/divyaparadkar"}
}

if 'authenticated' not in st.session_state:
    st.session_state['authenticated'] = False
if 'user_info' not in st.session_state:
    st.session_state['user_info'] = None

if not st.session_state['authenticated']:
    st.markdown("<br>", unsafe_allow_html=True)
    login_col1, login_col2, login_col3 = st.columns([1, 2, 1])
    
    with login_col2:
        st.markdown("""
            <div class="glass-card pink-glow-border" style="padding: 28px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">💖</div>
                <h2 style="margin: 0; background: linear-gradient(135deg, #f472b6 0%, #d946ef 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ShopAssist AI 2.0 Streamlit Login
                </h2>
                <p style="color: #d8b4fe; font-size: 0.9rem; margin-top: 6px;">Sign in to access your NLP Chatbot & Intent Workbench</p>
            </div>
        """, unsafe_allow_html=True)

        with st.form("login_form"):
            username_input = st.text_input("👤 Username:", placeholder="e.g., divya or admin")
            password_input = st.text_input("🔑 Password:", type="password", placeholder="Enter password")
            submit_login = st.form_submit_button("🔓 Sign In to ShopAssist")

            if submit_login:
                u_clean = username_input.strip().lower()
                if u_clean in USERS and USERS[u_clean]["password"] == password_input:
                    st.session_state['authenticated'] = True
                    st.session_state['user_info'] = USERS[u_clean]
                    st.success(f"Welcome back, {USERS[u_clean]['name']}! Loading ShopAssist...")
                    time.sleep(0.4)
                    st.rerun()
                else:
                    st.error("Invalid username or password. Please use demo credentials below.")

        st.markdown("""
            <div class="glass-card" style="margin-top: 15px; font-size: 0.85rem; color: #d8b4fe;">
                <p style="margin-bottom: 6px;"><strong>💡 Demo Credentials for Instant Access:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>👤 Username: <code style="color:#f472b6;">divya</code> | 🔑 Password: <code style="color:#f472b6;">pink123</code></li>
                    <li>👤 Username: <code style="color:#f472b6;">admin</code> | 🔑 Password: <code style="color:#f472b6;">admin123</code></li>
                </ul>
            </div>
        """, unsafe_allow_html=True)

        st.markdown("##### ⚡ Quick 1-Click Instant Login:")
        q_btn1, q_btn2 = st.columns(2)
        with q_btn1:
            if st.button("👩‍💻 Quick Login as Divya"):
                st.session_state['authenticated'] = True
                st.session_state['user_info'] = USERS["divya"]
                st.rerun()
        with q_btn2:
            if st.button("⚡ Quick Login as Admin"):
                st.session_state['authenticated'] = True
                st.session_state['user_info'] = USERS["admin"]
                st.rerun()

    st.stop()

# ==============================================================================
# NLP Engine Logic in Python
# ==============================================================================

STOPWORDS = {'a', 'an', 'the', 'is', 'are', 'am', 'be', 'do', 'does', 'did', 'for', 'to',
             'in', 'on', 'at', 'with', 'by', 'of', 'and', 'or', 'so', 'if', 'it', 'its',
             'my', 'your', 'me', 'you', 'we', 'i', 'this', 'that', 'these', 'those'}

def stem(word):
    if not word:
        return ''
    w = word.lower()
    if len(w) <= 3:
        return w
    if w.endswith('ing'): w = w[:-3]
    elif w.endswith('ed'): w = w[:-2]
    elif w.endswith('es'): w = w[:-2]
    elif w.endswith('s') and not w.endswith('ss'): w = w[:-1]
    elif w.endswith('ment'): w = w[:-4]
    return w

def tokenize(text):
    if not text:
        return []
    cleaned = re.sub(r'[^\w\s-]', ' ', text.lower())
    return [t for t in cleaned.split() if len(t) > 0]

def extract_order_id(text):
    if not text:
        return None
    match = re.search(r'\b(ORD-?\d{4,6}|\d{6}|#\d{6})\b', text, re.IGNORECASE)
    if match:
        clean = match.group(0).upper().replace('#', '')
        if re.match(r'^\d{6}$', clean):
            return clean
        if not '-' in clean and clean.startswith('ORD'):
            return clean.replace('ORD', 'ORD-')
        return clean
    return None

def calculate_string_similarity(str1, str2):
    s1 = str1.lower().strip()
    s2 = str2.lower().strip()
    if s1 == s2:
        return 1.0
    if s1 in s2 or s2 in s1:
        return 0.85
    tokens1 = [stem(t) for t in tokenize(s1)]
    tokens2 = [stem(t) for t in tokenize(s2)]
    if not tokens1 or not tokens2:
        return 0.0
    set2 = set(tokens2)
    matches = sum(1 for t in tokens1 if t in set2)
    jaccard = matches / len(set(tokens1 + tokens2))
    return jaccard

def classify_intent(user_input, intents_list, current_context=""):
    if not user_input or not user_input.strip():
        return {
            "intent": None, "confidence": 0, "matchedPattern": None,
            "response": "Please enter a message.", "context_set": "", "scores": []
        }
    
    raw_input = user_input.strip()
    detected_order_id = extract_order_id(raw_input)
    
    if detected_order_id:
        is_cancel = bool(re.search(r'cancel|stop|wrong item|revoke', raw_input, re.IGNORECASE)) or current_context == 'awaiting_cancel'
        tag = 'cancel_order' if is_cancel else 'order_status'
        matching = next((i for i in intents_list if i['tag'] == tag), intents_list[0])
        return {
            "intent": tag,
            "confidence": 0.98,
            "matchedPattern": detected_order_id,
            "orderId": detected_order_id,
            "response": matching['responses'][0] if matching else f"Looking up Order ID #{detected_order_id}...",
            "context_set": "",
            "scores": [{"tag": tag, "score": 0.98}]
        }
    
    scores = []
    for intent in intents_list:
        max_score = 0.0
        best_pattern = ""
        for pattern in intent['patterns']:
            sim = calculate_string_similarity(raw_input, pattern)
            if sim > max_score:
                max_score = sim
                best_pattern = pattern
        if current_context and intent.get('context_set') == current_context:
            max_score += 0.15
        scores.append({
            "tag": intent['tag'],
            "intent": intent,
            "score": min(max_score, 1.0),
            "bestPattern": best_pattern
        })
    
    scores.sort(key=lambda x: x['score'], reverse=True)
    top_match = scores[0]
    
    if top_match['score'] >= 0.22:
        selected = top_match['intent']
        chosen_resp = random.choice(selected['responses'])
        return {
            "intent": selected['tag'],
            "confidence": round(top_match['score'], 2),
            "matchedPattern": top_match['bestPattern'],
            "response": chosen_resp,
            "context_set": selected.get('context_set', ''),
            "scores": [{"tag": s['tag'], "score": round(s['score'], 2)} for s in scores]
        }
    
    return {
        "intent": "fallback",
        "confidence": 0.05,
        "matchedPattern": None,
        "response": "I'm sorry, I didn't quite understand that. You can ask me about tracking orders, cancellations, returns, shipping, or speaking with a live agent!",
        "context_set": "",
        "scores": [{"tag": s['tag'], "score": round(s['score'], 2)} for s in scores[:3]]
    }

# ==============================================================================
# Data Initialization in Session State
# ==============================================================================

if 'intents' not in st.session_state:
    try:
        with open('public/intents.json', 'r', encoding='utf-8') as f:
            st.session_state['intents'] = json.load(f)['intents']
    except Exception:
        st.session_state['intents'] = [
            {"tag": "greeting", "patterns": ["Hi", "Hello"], "responses": ["Hello! How can I help you today?"], "context_set": ""},
            {"tag": "order_status", "patterns": ["Where is my order?"], "responses": ["Please enter your 6-digit Order ID."], "context_set": "awaiting_order_id"}
        ]

if 'orders' not in st.session_state:
    st.session_state['orders'] = {
        "ORD-1024": {
            "id": "ORD-1024",
            "customer": "Alex Morgan",
            "date": "2026-10-06 14:30",
            "status": "in_transit",
            "statusText": "In Transit",
            "carrier": "FedEx Express",
            "trackingNumber": "FX-948201948",
            "estimatedDelivery": "Tomorrow, 5:00 PM",
            "shippingAddress": "742 Evergreen Terrace, Springfield, OR",
            "items": [
                {"name": "Wireless Noise-Canceling Headphones", "qty": 1, "price": 129.99, "image": "🎧"},
                {"name": "USB-C Nylon Braided Cable (6ft)", "qty": 1, "price": 19.99, "image": "🔌"}
            ],
            "total": 149.98,
            "paymentMethod": "Visa ending in 4242",
            "canCancel": False,
            "cancelReason": "Order has already been shipped and is in transit."
        },
        "ORD-8821": {
            "id": "ORD-8821",
            "customer": "Jordan Vance",
            "date": "2026-10-07 12:15",
            "status": "processing",
            "statusText": "Processing",
            "carrier": "Preparing for Shipment",
            "trackingNumber": "Pending",
            "estimatedDelivery": "Friday, Oct 10",
            "shippingAddress": "100 Tech Boulevard, Austin, TX",
            "items": [
                {"name": "Ultra-Soft Cotton Hoodie (Navy / L)", "qty": 1, "price": 59.00, "image": "🧥"}
            ],
            "total": 59.00,
            "paymentMethod": "Apple Pay",
            "canCancel": True,
            "cancelReason": ""
        },
        "123456": {
            "id": "123456",
            "customer": "Sam Taylor",
            "date": "2026-10-07 13:10",
            "status": "processing",
            "statusText": "Processing",
            "carrier": "Preparing for Shipment",
            "trackingNumber": "Pending",
            "estimatedDelivery": "Saturday, Oct 11",
            "shippingAddress": "456 Market St, San Francisco, CA",
            "items": [
                {"name": "Ergonomic Mechanical Keyboard (RGB)", "qty": 1, "price": 119.50, "image": "⌨️"}
            ],
            "total": 119.50,
            "paymentMethod": "PayPal",
            "canCancel": True,
            "cancelReason": ""
        }
    }

if 'messages' not in st.session_state:
    st.session_state['messages'] = [
        {
            "sender": "bot",
            "text": "Hello! Welcome to ShopAssist Pink Edition. How can I assist you today?",
            "intent": "greeting",
            "confidence": 1.0,
            "timestamp": datetime.now().strftime("%H:%M")
        }
    ]

if 'current_context' not in st.session_state:
    st.session_state['current_context'] = ""

# ==============================================================================
# Header UI
# ==============================================================================

current_user = st.session_state.get('user_info', {})
u_name = current_user.get('name', 'Divya Paradkar')
u_avatar = current_user.get('avatar', '👩‍💻')
u_role = current_user.get('role', 'Developer')

col_head1, col_head2, col_head3 = st.columns([3, 1, 1])

with col_head1:
    st.markdown(f"""
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <div style="background: linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%); padding: 10px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 24px;">{u_avatar}</span>
            </div>
            <div>
                <h1 style="margin: 0; font-size: 1.7rem; font-weight: 800; background: linear-gradient(135deg, #f472b6 0%, #d946ef 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    ShopAssist AI 2.0 <span class="badge-pink">Streamlit Pink Edition</span>
                </h1>
                <span style="color: #d8b4fe; font-size: 0.85rem;">Welcome back, <strong>{u_name}</strong> ({u_role}) • Natural Language Assistant</span>
            </div>
        </div>
    """, unsafe_allow_html=True)

with col_head2:
    st.markdown("""
        <div style="background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 9999px; border: 1px solid rgba(244, 114, 182, 0.2); display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: #d8b4fe;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
            <span>Live Support Engine</span>
        </div>
    """, unsafe_allow_html=True)

with col_head3:
    if st.button("🚪 Logout", key="hdr_logout"):
        st.session_state['authenticated'] = False
        st.session_state['user_info'] = None
        st.rerun()

st.markdown("---")

# ==============================================================================
# Main Navigation Tabs
# ==============================================================================

tab_chat, tab_studio, tab_orders, tab_metrics = st.tabs([
    "💬 ShopBot Chat",
    "⚙️ Intent Studio",
    "📦 Orders Sandbox",
    "📊 NLP Metrics"
])

# ------------------------------------------------------------------------------
# TAB 1: ShopBot Chat View
# ------------------------------------------------------------------------------
with tab_chat:
    st.markdown("""
        <div class="glass-card" style="padding: 12px 18px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; color: #d8b4fe;">
                    ✨ Active Conversation Context: <strong style="color: #f472b6;">{}</strong>
                </span>
                <span style="font-size: 0.8rem; color: #a855f7;">💡 Click any sample prompt below or type your query in the input bar!</span>
            </div>
        </div>
    """.format(st.session_state['current_context'] or 'Ready (Standard State)'), unsafe_allow_html=True)

    # Easy Quick Prompts Launcher Row
    st.markdown("##### 🌸 Easy Quick Action Assistant:")
    q_col1, q_col2, q_col3, q_col4, q_col5, q_col6 = st.columns(6)
    
    prompt_to_send = None
    with q_col1:
        if st.button("📍 Order #ORD-1024", key="qp1"):
            prompt_to_send = "Where is my order ORD-1024?"
    with q_col2:
        if st.button("❌ Cancel ORD-8821", key="qp2"):
            prompt_to_send = "Cancel my order ORD-8821"
    with q_col3:
        if st.button("💳 Payment Options", key="qp3"):
            prompt_to_send = "What payment options do you accept?"
    with q_col4:
        if st.button("📦 Return Policy", key="qp4"):
            prompt_to_send = "How do I return an item?"
    with q_col5:
        if st.button("🚚 Shipping Rates", key="qp5"):
            prompt_to_send = "How much is shipping?"
    with q_col6:
        if st.button("👩‍💼 Live Support", key="qp6"):
            prompt_to_send = "I want to speak to a real person"

    st.markdown("<br>", unsafe_allow_html=True)

    # Display Chat Messages
    chat_container = st.container()
    with chat_container:
        for msg in st.session_state['messages']:
            if msg['sender'] == 'bot':
                with st.chat_message("assistant", avatar="🤖"):
                    intent_tag = msg.get('intent', '')
                    conf = msg.get('confidence', 1.0)
                    st.markdown(f"**ShopBot** <span class='intent-pill'>Tag: {intent_tag} ({int(conf*100)}% match)</span>", unsafe_allow_html=True)
                    st.write(msg['text'])
                    
                    # Render matched order card if order lookup triggered
                    order_data = msg.get('orderData')
                    if order_data:
                        st.markdown(f"""
                            <div class="glass-card pink-glow-border" style="margin-top: 10px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <h4 style="margin:0; color: #ec4899;">📦 Order #{order_data['id']}</h4>
                                    <span class="status-badge status-{order_data['status']}">{order_data['statusText']}</span>
                                </div>
                                <p style="font-size: 0.85rem; color: #d8b4fe; margin-bottom: 4px;"><strong>Customer:</strong> {order_data['customer']} | <strong>Placed:</strong> {order_data['date']}</p>
                                <p style="font-size: 0.85rem; color: #d8b4fe; margin-bottom: 4px;"><strong>Carrier:</strong> {order_data['carrier']} ({order_data['trackingNumber']})</p>
                                <p style="font-size: 0.85rem; color: #f472b6; margin-bottom: 10px;"><strong>Est. Delivery:</strong> {order_data['estimatedDelivery']}</p>
                                <div style="border-top: 1px dashed rgba(244, 114, 182, 0.2); padding-top: 8px; display: flex; justify-content: space-between; font-weight: 700;">
                                    <span>Total Paid:</span>
                                    <span style="color: #10b981;">${order_data['total']:.2f}</span>
                                </div>
                            </div>
                        """, unsafe_allow_html=True)
                    
                    # Render visual widgets based on intent
                    if intent_tag == 'payment_methods':
                        st.info("💳 **Accepted Payments:** Visa, MasterCard, American Express, PayPal, Apple Pay (256-bit Encrypted)")
                    elif intent_tag == 'store_hours':
                        st.info("🕒 **Support Schedule:** Mon-Fri 8:00 AM - 8:00 PM EST (Live Agents). ShopBot AI is online 24/7!")
                    elif intent_tag == 'shipping_policy':
                        st.info("🚚 **Shipping Tiers:** Standard ($4.99, 3-5 days), Free Shipping (Orders > $50), Expedited ($12.99, 1-2 days)")
                    elif intent_tag == 'human_agent':
                        st.success("👩‍💼 **Ticket Escalated:** Queue Wait Time < 2 minutes. Support Email: support@example.com")
            else:
                with st.chat_message("user", avatar="👤"):
                    st.write(msg['text'])

    # Chat Input Processing
    user_input = st.chat_input("Ask ShopBot anything (e.g., Where is order ORD-1024?, refund policy, shipping rates)...")
    if prompt_to_send:
        user_input = prompt_to_send

    if user_input:
        # Append User Message
        user_msg = {
            "sender": "user",
            "text": user_input,
            "timestamp": datetime.now().strftime("%H:%M")
        }
        st.session_state['messages'].append(user_msg)
        
        # Run NLP Classification
        result = classify_intent(user_input, st.session_state['intents'], st.session_state['current_context'])
        
        # Check order lookup if orderId detected
        matched_order = None
        if result.get('orderId'):
            ord_id = result['orderId']
            matched_order = st.session_state['orders'].get(ord_id)
            if not matched_order and len(ord_id) >= 5:
                matched_order = {
                    "id": ord_id, "customer": "Guest User", "date": "Recent",
                    "status": "processing", "statusText": "Processing", "carrier": "Standard Parcel",
                    "trackingNumber": f"TRK-{random.randint(1000000, 9999999)}",
                    "estimatedDelivery": "In 3 Business Days", "shippingAddress": "100 Main St, Cityville",
                    "items": [{"name": "ShopAssist Parcel Item", "qty": 1, "price": 49.99, "image": "📦"}],
                    "total": 49.99, "paymentMethod": "Credit Card", "canCancel": True, "cancelReason": ""
                }

        bot_text = result['response']
        if result['intent'] == 'order_status' and matched_order:
            bot_text = f"Here are the latest tracking details for Order #{matched_order['id']}:"
        elif result['intent'] == 'cancel_order' and matched_order:
            if matched_order['canCancel'] and matched_order['status'] != 'canceled':
                bot_text = f"Order #{matched_order['id']} is processing and eligible for instant cancellation:"
            elif matched_order['status'] == 'canceled':
                bot_text = f"Order #{matched_order['id']} has already been canceled."
            else:
                bot_text = f"Order #{matched_order['id']} cannot be canceled because it has already shipped ({matched_order['statusText']})."

        bot_msg = {
            "sender": "bot",
            "text": bot_text,
            "intent": result['intent'],
            "confidence": result['confidence'],
            "orderData": matched_order,
            "timestamp": datetime.now().strftime("%H:%M")
        }
        st.session_state['messages'].append(bot_msg)
        st.session_state['current_context'] = result.get('context_set', '')
        st.rerun()

# ------------------------------------------------------------------------------
# TAB 2: Intent Studio View
# ------------------------------------------------------------------------------
with tab_studio:
    st.markdown("""
        <div class="glass-card">
            <h3>⚙️ Intent Studio & Training Workbench</h3>
            <p style="color: #d8b4fe; font-size: 0.85rem;">
                💡 Easy Guide: Select any intent tag on the left to edit its training patterns or test natural language classification in real-time.
            </p>
        </div>
    """, unsafe_allow_html=True)

    col_studio_left, col_studio_right = st.columns([1, 2])

    with col_studio_left:
        st.markdown("##### Intents Dataset")
        intent_tags = [i['tag'] for i in st.session_state['intents']]
        selected_tag = st.selectbox("Select Intent Tag:", intent_tags)
        
        selected_intent = next((i for i in st.session_state['intents'] if i['tag'] == selected_tag), st.session_state['intents'][0])
        
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("##### ➕ Create New Intent")
        with st.form("new_intent_form"):
            new_tag = st.text_input("New Intent Tag (slug):", placeholder="e.g. promo_codes")
            new_patterns = st.text_area("Training Patterns (1 per line):", placeholder="Do you have discount codes?")
            new_responses = st.text_area("Bot Responses (1 per line):", placeholder="Enter promo code at checkout!")
            submit_new = st.form_submit_button("Create Intent")
            if submit_new and new_tag:
                tag_clean = new_tag.strip().lower().replace(" ", "_")
                if not any(i['tag'] == tag_clean for i in st.session_state['intents']):
                    created = {
                        "tag": tag_clean,
                        "patterns": [p.strip() for p in new_patterns.split("\n") if p.strip()] or ["Sample pattern"],
                        "responses": [r.strip() for r in new_responses.split("\n") if r.strip()] or ["Sample response"],
                        "context_set": ""
                    }
                    st.session_state['intents'].append(created)
                    st.success(f"Created intent '{tag_clean}'!")
                    st.rerun()

    with col_studio_right:
        st.markdown(f"#### Edit Intent: <span style='color:#ec4899;'>{selected_tag}</span>", unsafe_allow_html=True)
        
        p_text = st.text_area("Training Patterns (One phrase per line):", value="\n".join(selected_intent['patterns']), height=160)
        r_text = st.text_area("Bot Responses (One response per line):", value="\n".join(selected_intent['responses']), height=140)
        c_text = st.text_input("Set Context State (Optional):", value=selected_intent.get('context_set', ''))

        col_sav1, col_sav2 = st.columns([1, 1])
        with col_sav1:
            if st.button("💾 Save Intent Changes"):
                p_arr = [p.strip() for p in p_text.split("\n") if p.strip()]
                r_arr = [r.strip() for r in r_text.split("\n") if r.strip()]
                for idx, item in enumerate(st.session_state['intents']):
                    if item['tag'] == selected_tag:
                        st.session_state['intents'][idx]['patterns'] = p_arr
                        st.session_state['intents'][idx]['responses'] = r_arr
                        st.session_state['intents'][idx]['context_set'] = c_text.strip()
                        break
                st.success(f"Saved changes for intent '{selected_tag}'!")
                st.rerun()

        st.markdown("---")
        st.markdown("##### 🧪 Live NLP Classifier Test Console")
        test_phrase = st.text_input("Type a test sentence (e.g., 'Where is package ORD-1024?', 'Can I use Apple Pay?'):")
        if test_phrase:
            res = classify_intent(test_phrase, st.session_state['intents'])
            st.markdown(f"""
                <div class="glass-card pink-glow-border">
                    <p style="margin:0;"><strong>Predicted Intent:</strong> <span style="color:#ec4899; font-size:1.1rem; font-weight:800;">{res['intent']}</span> | <strong>Confidence Score:</strong> <span style="color:#10b981; font-size:1.1rem; font-weight:800;">{int(res['confidence']*100)}%</span></p>
                    <p style="margin-top:4px; font-size:0.85rem; color:#d8b4fe;"><strong>Matched Pattern:</strong> "{res.get('matchedPattern', 'N/A')}"</p>
                </div>
            """, unsafe_allow_html=True)
            
            st.write("**Top Score Ranking Breakdown:**")
            for sc in res['scores'][:5]:
                st.progress(sc['score'], text=f"{sc['tag']}: {int(sc['score']*100)}%")

# ------------------------------------------------------------------------------
# TAB 3: Orders Sandbox View
# ------------------------------------------------------------------------------
with tab_orders:
    st.markdown("""
        <div class="glass-card">
            <h3>📦 Orders Sandbox & Simulator</h3>
            <p style="color: #d8b4fe; font-size: 0.85rem;">
                💡 Easy Simulator: Select an order and switch its fulfillment status in real-time to observe how ShopBot handles tracking and cancellation rules.
            </p>
        </div>
    """, unsafe_allow_html=True)

    col_ord_left, col_ord_right = st.columns([1, 2])

    with col_ord_left:
        st.markdown("##### Mock Orders Database")
        selected_ord_id = st.selectbox("Select Order ID to Inspect:", list(st.session_state['orders'].keys()))
        ord_obj = st.session_state['orders'][selected_ord_id]

    with col_ord_right:
        st.markdown(f"#### Order Inspector: <span style='color:#ec4899;'>#{ord_obj['id']}</span>", unsafe_allow_html=True)
        
        st.markdown("**Simulate Order Fulfillment Status:**")
        b_col1, b_col2, b_col3, b_col4 = st.columns(4)
        
        with b_col1:
            if st.button("🕒 Processing", key="st_proc"):
                st.session_state['orders'][selected_ord_id]['status'] = 'processing'
                st.session_state['orders'][selected_ord_id]['statusText'] = 'Processing'
                st.session_state['orders'][selected_ord_id]['canCancel'] = True
                st.rerun()
        with b_col2:
            if st.button("🚚 In Transit", key="st_trans"):
                st.session_state['orders'][selected_ord_id]['status'] = 'in_transit'
                st.session_state['orders'][selected_ord_id]['statusText'] = 'In Transit'
                st.session_state['orders'][selected_ord_id]['canCancel'] = False
                st.session_state['orders'][selected_ord_id]['cancelReason'] = 'Order has already shipped.'
                st.rerun()
        with b_col3:
            if st.button("✅ Delivered", key="st_deliv"):
                st.session_state['orders'][selected_ord_id]['status'] = 'delivered'
                st.session_state['orders'][selected_ord_id]['statusText'] = 'Delivered'
                st.session_state['orders'][selected_ord_id]['canCancel'] = False
                st.session_state['orders'][selected_ord_id]['cancelReason'] = 'Order has been delivered.'
                st.rerun()
        with b_col4:
            if st.button("❌ Canceled", key="st_canc"):
                st.session_state['orders'][selected_ord_id]['status'] = 'canceled'
                st.session_state['orders'][selected_ord_id]['statusText'] = 'Canceled'
                st.session_state['orders'][selected_ord_id]['canCancel'] = False
                st.rerun()

        # Detailed Order Inspector Card
        st.markdown(f"""
            <div class="glass-card pink-glow-border" style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin:0; color: #ec4899;">Order #{ord_obj['id']}</h3>
                    <span class="status-badge status-{ord_obj['status']}">{ord_obj['statusText']}</span>
                </div>
                <p style="color: #d8b4fe; font-size: 0.85rem; margin-top: 4px;">Customer: <strong>{ord_obj['customer']}</strong> | Date: <strong>{ord_obj['date']}</strong></p>
                <hr style="border-color: rgba(244, 114, 182, 0.2);">
                <p style="font-size: 0.9rem;"><strong>Shipping Carrier:</strong> {ord_obj['carrier']}</p>
                <p style="font-size: 0.9rem;"><strong>Tracking #:</strong> <code>{ord_obj['trackingNumber']}</code></p>
                <p style="font-size: 0.9rem;"><strong>Estimated Delivery:</strong> {ord_obj['estimatedDelivery']}</p>
                <p style="font-size: 0.9rem;"><strong>Shipping Address:</strong> {ord_obj['shippingAddress']}</p>
                <p style="font-size: 0.9rem;"><strong>Payment Method:</strong> {ord_obj['paymentMethod']}</p>
                <hr style="border-color: rgba(244, 114, 182, 0.2);">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem;">
                    <span>Total Amount:</span>
                    <span style="color: #10b981;">${ord_obj['total']:.2f}</span>
                </div>
            </div>
        """, unsafe_allow_html=True)

# ------------------------------------------------------------------------------
# TAB 4: NLP Metrics & Analytics
# ------------------------------------------------------------------------------
with tab_metrics:
    st.markdown("""
        <div class="glass-card">
            <h3>📊 NLP Engine Metrics & Performance Analytics</h3>
        </div>
    """, unsafe_allow_html=True)

    intents_list = st.session_state['intents']
    total_intents = len(intents_list)
    total_patterns = sum(len(i['patterns']) for i in intents_list)
    total_responses = sum(len(i['responses']) for i in intents_list)
    contextual_count = sum(1 for i in intents_list if i.get('context_set'))

    m_col1, m_col2, m_col3, m_col4 = st.columns(4)
    m_col1.metric("Intent Classes", total_intents, "Structured Tags")
    m_col2.metric("Training Patterns", total_patterns, f"Avg ~{round(total_patterns/max(total_intents,1), 1)}/tag")
    m_col3.metric("Bot NLG Responses", total_responses, "Natural Variations")
    m_col4.metric("Context Handlers", contextual_count, "Multi-turn States")

    st.markdown("<br>", unsafe_allow_html=True)
    col_chart1, col_chart2 = st.columns([1, 1])

    with col_chart1:
        st.markdown("##### Pattern Volume by Intent Class")
        chart_data = {i['tag']: len(i['patterns']) for i in intents_list}
        st.bar_chart(chart_data)

    with col_chart2:
        st.markdown("##### NLP Architecture Specifications")
        st.markdown("""
            <div class="glass-card">
                <p><strong>Matching Algorithm:</strong> Hybrid TF-IDF Cosine Similarity + N-Gram Jaccard Distance + Regex Entity Recognition</p>
                <p><strong>Confidence Threshold:</strong> 0.22 Similarity Score (Lower scores trigger Fallback Dialog)</p>
                <p><strong>Context Engine:</strong> Stateful Context Tracking (<code>awaiting_order_id</code> state transitions)</p>
                <p><strong>Entity Extraction:</strong> 6-Digit Order IDs, <code>ORD-XXXX</code> identifiers, and carrier tracking strings</p>
            </div>
        """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("<div style='text-align: center; color: #f472b6; font-size: 0.9rem;'>ShopAssist AI 2.0 • Streamlit Pink Edition • Developed by <a href='https://github.com/divyaparadkar' target='_blank' style='color:#ec4899; font-weight:700; text-decoration:none;'>Divya Paradkar</a> ✨</div>", unsafe_allow_html=True)
