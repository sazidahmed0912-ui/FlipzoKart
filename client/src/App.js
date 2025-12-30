import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutForm from './components/CheckoutForm';
import ModernOrderConfirmation from './components/ModernOrderConfirmation';

const API = process.env.REACT_APP_API_URL;

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [shipping, setShipping] = useState({
    name: '', phone: '', address: '', city: '', state: '',
    pincode: '', locality: '', landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // ================= AUTH =================

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.user);
        setCurrentPage('shop');
        fetchProducts();
        fetchOrders();
      })
      .catch(() => localStorage.clear());
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    const res = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    fetchProducts();
    fetchOrders();
    setCurrentPage('shop');
    setLoading(false);
  };

  const handleSignup = async (name, email, password) => {
    setLoading(true);
    const res = await axios.post(`${API}/api/auth/signup`, { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    fetchProducts();
    fetchOrders();
    setCurrentPage('shop');
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCart([]);
    setCurrentPage('login');
  };

  // ================= PRODUCTS =================

  const fetchProducts = () => {
    axios.get(`${API}/api/products`)
      .then(res => setProducts(res.data));
  };

  const addToCart = (p) => {
    const found = cart.find(i => i._id === p._id);
    let newCart;
    if (found) {
      newCart = cart.map(i => i._id === p._id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...cart, { ...p, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // ================= ORDERS =================

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    axios.get(`${API}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data));
  };

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    const items = cart.map(i => ({
      productId: i._id,
      name: i.name,
      price: i.price,
      quantity: i.qty
    }));

    await axios.post(`${API}/api/orders`, {
      items,
      shipping,
      paymentMethod,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCart([]);
    localStorage.removeItem('cart');
    fetchOrders();
    setCurrentPage('thankyou');
  };

  // ================= UI =================

  if (currentPage === 'thankyou') {
    const latest = orders[0];
    return (
      <ModernOrderConfirmation
        order={latest}
        customer={latest?.shipping}
        onContinueShopping={() => setCurrentPage('shop')}
        supportEmail="support@flipzokart.com"
        supportWhatsapp="6033394539"
      />
    );
  }

  return (
    <div>
      <h1>Flipzokart is Live 🚀</h1>
      {/* UI components yahan attach karo (login, shop, cart, checkout etc.) */}
    </div>
  );
}

export default App;
