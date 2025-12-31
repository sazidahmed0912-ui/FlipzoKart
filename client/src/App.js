/*
==============================
ORDER CONFIRMATION – PROFESSIONAL TEMPLATE
==============================
Subject:
Order Confirmed – Thank You for Shopping with [Brand Name]

Hello [Customer Name],
Thank you for placing your order with [Brand Name].
We’re happy to confirm that your order has been successfully received.

Order Summary
- Order ID: #[Order Number]
- Order Date: [Date & Time]
- Payment Method: [COD / UPI / Card / Net Banking]
- Payment Status: [Paid / Cash on Delivery]

Product Details
- Product Name: [Product Name]
- Quantity: [Qty]
- Price: ₹[Amount]

Delivery Information
- Shipping Address:
  [Full Address]
- Estimated Delivery:
  [Delivery Date Range]
You will receive another notification once your order is shipped.

What Happens Next?
- Order verification & processing
- Dispatch from our warehouse
- Delivery to your doorstep

Need Help?
If you have any questions or need assistance, feel free to contact us:
- Email: support@[yourdomain].com
- WhatsApp/Phone: +91-XXXXXXXXXX
- Support Hours: [Timing]

Thank You
We appreciate your trust in [Brand Name] and look forward to serving you again.
Warm regards,
Team [Brand Name]
[Website URL]
==============================
*/
import React, { useState, useEffect } from 'react';
import CheckoutForm from './components/CheckoutForm';
import OrderConfirmationTemplate from './components/OrderConfirmationTemplate';
import ModernOrderConfirmation from './components/ModernOrderConfirmation';
import axios from 'axios';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'home', 'shop', 'categories', 'cart', 'checkout', 'account', 'admin'
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  // Persistent cart using localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [form, setForm] = useState({ name: '', price: '', image: '', category: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://flipzokart-backend.onrender.com/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUser(res.data.user);
          setCurrentPage('home');
          fetchProducts();
          fetchOrders(); // Fetch orders on login
        })
        .catch(() => {
          localStorage.removeItem('token');
          setCurrentPage('login');
        });
    }
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // If redirected back from Stripe Checkout, finalize order creation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success' && params.get('session_id')) {
      const sessionId = params.get('session_id');
      const token = localStorage.getItem('token');
      // call backend to convert session into an order
      axios.post('https://flipzokart-backend.onrender.com/api/checkout-success', { sessionId }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          alert('✅ Payment successful and order created');
          setCart([]);
          fetchProducts();
          setCurrentPage('shop');
          // remove params from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => {
          console.error('Checkout finalize error', err);
        });
    }
  }, []);

  const fetchProducts = () => {
    axios.get('https://flipzokart-backend.onrender.com/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error:", err));
  };

  // ===== SIGNUP =====

  // Always call hooks at the top level (fix for React Hooks error)
  useEffect(() => {
    if (user && currentPage === 'account') {
      fetchOrders();
    }
    // Also fetch orders after thankyou navigation for user role
    if (user && currentPage === 'thankyou') {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [user, currentPage]);
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const name = document.getElementById('signup-name').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    axios.post('https://flipzokart-backend.onrender.com/api/auth/signup', { name, email, password })
      .then(res => {
        alert("✅ Signup successful! Please log in.");
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setCurrentPage('shop');
        fetchProducts();
        setTimeout(() => fetchOrders(), 500); // Ensure orders fetched after signup
      })
      .catch(err => alert("❌ Error: " + (err.response?.data?.error || err.message)))
      .finally(() => setLoading(false));
  };

  // ===== LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    setLoading(true);
    axios.post('https://flipzokart-backend.onrender.com/api/auth/login', { email, password })
      .then(res => {
        alert("✅ Login successful!");
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setCurrentPage('shop');
        fetchProducts();
        setTimeout(() => fetchOrders(), 500); // Ensure orders fetched after login
      })
      .catch(err => alert("❌ Error: " + (err.response?.data?.error || err.message)))
      .finally(() => setLoading(false));
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProducts([]);
    setCart([]);
    setCurrentPage('login');
  };

  // ADD TO CART
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;
    if (existingItem) {
      newCart = cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert("✅ Product added to cart!");
  };

  // REMOVE FROM CART
  const handleRemoveFromCart = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // UPDATE CART QUANTITY
  const handleUpdateQuantity = (productId, quantity) => {
    let newCart;
    if (quantity <= 0) {
      newCart = cart.filter(item => item._id !== productId);
    } else {
      newCart = cart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      );
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  // CALCULATE TOTAL
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Add Product
  const handleAdd = () => {
    if (!form.name || !form.price || !form.image) {
      alert("⚠️ Name, Price and Image are required!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    axios.post('https://flipzokart-backend.onrender.com/api/products', form, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("✅ Product Added!");
        setForm({ name: '', price: '', image: '', category: '', stock: '' });
        fetchProducts();
      })
      .catch(err => alert("❌ Error: " + err.message))
      .finally(() => setLoading(false));
  };


  // ===== ORDERS (Frontend) =====
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [shipping, setShipping] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '', locality: '', landmark: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: shipping, 2: payment
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to place an order');
      setCurrentPage('login');
      return;
    }
    if (cart.length === 0) return alert('Cart is empty');
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || !shipping.locality || !shipping.landmark) {
      return alert('Please fill all shipping details');
    }
    const items = cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity }));
    setOrderLoading(true);
    const token = localStorage.getItem('token');
    axios.post('https://flipzokart-backend.onrender.com/api/orders', { items, total: cartTotal, shipping }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        alert('✅ Order placed successfully!');
        setCart([]);
        setShipping({ address: '', city: '', pincode: '', phone: '' });
        fetchOrders();
        setCurrentPage('shop');
      })
      .catch(err => alert('❌ Error placing order: ' + (err.response?.data?.error || err.message)))
      .finally(() => setOrderLoading(false));
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsRazorpayLoading(true);
      
      // Create Razorpay order
      const response = await axios.post('https://flipzokart-backend.onrender.com/api/payment/create-order', {
        amount: cartTotal
      });
      
      const { id, amount, currency } = response.data;
      
      // Razorpay checkout options
      const options = {
        key: 'rzp_test_RxknvH54hgJXNP',
        amount: amount,
        currency: currency,
        name: 'Flipzokart Order',
        description: 'Order Payment',
        image: 'https://example.com/your-logo.png',
        order_id: id,
        handler: function (response) {
          console.log('Razorpay response:', response);
          
          // After successful payment, create order
          const items = cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity }));
          const token = localStorage.getItem('token');
          
          axios.post('https://flipzokart-backend.onrender.com/api/orders', { 
            items, 
            total: cartTotal, 
            shipping, 
            paymentMethod: 'RAZORPAY',
            razorpayOrderId: id,
            razorpayPaymentId: response.razorpay_payment_id
          }, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
              setCart([]);
              localStorage.removeItem('cart');
              fetchOrders();
              setCurrentPage('thankyou');
              setRazorpayOrder(null);
            })
            .catch(err => {
              alert('❌ Error creating order: ' + (err.response?.data?.error || err.message));
            })
            .finally(() => {
              setIsRazorpayLoading(false);
            });
        },
        prefill: {
          contact: shipping.phone,
          email: shipping.email || '',
          name: shipping.name
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('❌ Payment failed: ' + error.message);
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('https://flipzokart-backend.onrender.com/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Orders fetch error', err.message));
  };

  const updateOrderStatus = (id, status) => {
    const token = localStorage.getItem('token');
    axios.put(`https://flipzokart-backend.onrender.com/api/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchOrders())
      .catch(err => alert('❌ Error: ' + (err.response?.data?.error || err.message)));
  };

  const handleDeleteOrder = (id) => {
    if (!window.confirm('Delete this order?')) return;
    const token = localStorage.getItem('token');
    axios.delete(`https://flipzokart-backend.onrender.com/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchOrders())
      .catch(err => alert('❌ Error: ' + (err.response?.data?.error || err.message)));
  };

  // Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const token = localStorage.getItem('token');
      axios.delete(`https://flipzokart-backend.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          alert("✅ Deleted!");
          fetchProducts();
        })
        .catch(err => alert("❌ Error: " + err.message));
    }
  };

  // ===== THANKYOU PAGE =====
  if (currentPage === 'thankyou') {
    // Find the latest order for the user (if available)
    const latestOrder = orders && orders.length > 0 ? orders[0] : null;
    const customer = latestOrder && latestOrder.shipping ? {
      name: latestOrder.shipping.name,
      phone: latestOrder.shipping.phone,
      email: user?.email,
    } : {};
    const products = latestOrder && latestOrder.items ? latestOrder.items.map(item => ({
      name: item.name,
      image: item.image || '/placeholder.png',
      quantity: item.quantity,
      price: item.price,
    })) : [];
    const priceDetails = latestOrder ? {
      subtotal: latestOrder.items ? latestOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0) : 0,
      shipping: latestOrder.shippingCharge || 0,
      discount: latestOrder.discount || 0,
      tax: latestOrder.tax || 0,
      total: latestOrder.total || (latestOrder.items ? latestOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + (latestOrder.shippingCharge || 0) + (latestOrder.tax || 0) - (latestOrder.discount || 0) : 0),
    } : {};
    // Format address as a single string
    const shippingAddress = latestOrder && latestOrder.shipping ? `${latestOrder.shipping.address}, ${latestOrder.shipping.locality}, ${latestOrder.shipping.landmark}, ${latestOrder.shipping.city}, ${latestOrder.shipping.state} - ${latestOrder.shipping.pincode}` : '';
    // Status and payment badges
    const statusBadge = (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">{latestOrder?.status || 'Confirmed'}</span>
    );
    const paymentBadge = (
      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">{latestOrder?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}</span>
    );
    return (
      <ModernOrderConfirmation
        order={{
          id: latestOrder?._id,
          date: latestOrder ? new Date(latestOrder.createdAt).toLocaleString() : '',
          paymentMethod: paymentBadge,
          status: statusBadge,
        }}
        customer={customer}
        shippingAddress={shippingAddress}
        products={products}
        priceDetails={priceDetails}
        onContinueShopping={() => setCurrentPage('shop')}
        onTrackOrder={() => window.alert('Track Order feature coming soon!')}
        onDownloadInvoice={() => window.alert('Download Invoice feature coming soon!')}
        supportEmail="support@flipzokart.com"
        supportWhatsapp="6033394539"
      />
    );
  }
  // ===== LOGIN PAGE =====
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Flipzokart</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">🔐 Login</h2>
            <input
              id="login-email"
              type="email"
              placeholder="📧 Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              required
            />
            <input
              id="login-password"
              type="password"
              placeholder="🔑 Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 font-bold rounded hover:bg-blue-700 disabled:bg-gray-500"
            >
              {loading ? "⏳ Loading..." : "✅ Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 font-bold hover:underline mt-2"
            >
              Sign up 👉
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== SIGNUP PAGE =====
  if (currentPage === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-green-600">Flipzokart</h1>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">📝 Sign Up</h2>
            <input
              id="signup-name"
              type="text"
              placeholder="👤 Full Name"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-600"
              required
            />
            <input
              id="signup-email"
              type="email"
              placeholder="📧 Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-600"
              required
            />
            <input
              id="signup-password"
              type="password"
              placeholder="🔑 Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-600"
              required
            />
            <input
              id="signup-confirm"
              type="password"
              placeholder="🔐 Confirm Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 font-bold rounded hover:bg-green-700 disabled:bg-gray-500"
            >
              {loading ? "⏳ Loading..." : "✅ Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <button
              onClick={() => setCurrentPage('login')}
              className="text-green-600 font-bold hover:underline mt-2"
            >
              Login 👉
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== NAVBAR COMPONENT =====
  const Navbar = () => (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between px-6 items-center shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-white/20 text-white rounded-full w-14 h-14 flex items-center justify-center font-extrabold text-2xl shadow-md">F</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Flipzokart</h1>
          <p className="text-xs opacity-80">Shop smart • Live happy</p>
        </div>
      </div>

      <div className="space-x-3 flex items-center">
        <button onClick={() => setCurrentPage('home')} className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 'home' ? 'bg-white text-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}>🏠 Home</button>
        <button onClick={() => setCurrentPage('categories')} className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 'categories' ? 'bg-white text-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}>📂 Categories</button>
        <button onClick={() => setCurrentPage('cart')} className={`px-4 py-2 rounded-lg font-semibold relative transition ${currentPage === 'cart' ? 'bg-white text-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}>
          🛒 Cart
          {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">{cart.length}</span>}
        </button>
        {/* Removed Order History button from navbar */}
        <button onClick={() => setCurrentPage('account')} className={`px-4 py-2 rounded-lg font-semibold transition ${currentPage === 'account' ? 'bg-white text-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}>👤 Account</button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">🚪 Logout</button>
      </div>
    </nav>
  );
  // ===== ORDER HISTORY PAGE REMOVED (merged into account) =====

  // ===== HOME PAGE =====
  if (currentPage === 'home') {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-24 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-6xl font-bold mb-4 leading-tight">
                🎉 Apka Number 1 <br /> E-Commerce Platform
              </h1>
              <p className="text-xl mb-2 opacity-90">Best products, Best prices, Best service!</p>
              <p className="text-lg mb-8 opacity-80">Lakh+ satisfied customers trust Flipzokart</p>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setCurrentPage('categories')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-indigo-900 px-8 py-3 rounded-2xl font-extrabold text-lg hover:scale-105 transform transition shadow-2xl"
                >
                  🛍️ Start Shopping
                </button>
                <button 
                  onClick={() => setCurrentPage('categories')}
                  className="bg-white/20 border border-white/30 text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:bg-white/30 hover:text-indigo-900 transition"
                >
                  📂 Explore Categories
                </button>
              </div>
              
              <div className="flex space-x-8 mt-12">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-sm opacity-90">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">100K+</p>
                  <p className="text-sm opacity-90">Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">24/7</p>
                  <p className="text-sm opacity-90">Support</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="text-9xl">🛒</div>
              <p className="text-2xl font-bold mt-4">Welcome to Flipzokart!</p>
              <p className="text-lg mt-2 opacity-90">👋 {user?.name}, Shop with confidence</p>
            </div>
          </div>
        </div>
        
        <div className="p-10">
          {/* FEATURED PRODUCTS */}
          <h2 className="text-3xl font-bold mb-6 text-center">🔥 Featured Products</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">❌ No products yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {products.slice(0, 4).map(p => (
                <div key={p._id} className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 overflow-hidden">
                  <div className="h-48 w-full bg-gradient-to-b from-white to-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                    <img src={p.image} className="h-full w-full object-contain" alt={p.name} />
                  </div>
                  <h2 className="font-bold mt-3 text-lg truncate">{p.name}</h2>
                  <p className="text-gray-500 text-sm">{p.category || 'General'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-green-600 font-bold text-xl">₹{p.price}</p>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{p.stock} in stock</span>
                  </div>
                  <button onClick={() => handleAddToCart(p)} className="mt-4 bg-indigo-600 text-white w-full py-2 rounded-xl font-semibold hover:bg-indigo-700 transform hover:scale-102 transition">🛒 Add to Cart</button>
                </div>
              ))}
            </div>
          )}

          {/* QUICK NAVIGATION */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">⚡ Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105 bg-gradient-to-br from-white/80 to-white/60" onClick={() => setCurrentPage('categories')}>
                <p className="text-4xl mb-3">📂</p>
                <h3 className="text-xl font-bold mb-2">Browse Categories</h3>
                <p className="text-gray-700">Explore different product categories</p>
              </div>
              <div className="p-6 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105 bg-gradient-to-br from-indigo-50 to-white/70" onClick={() => setCurrentPage('categories')}>
                <p className="text-4xl mb-3">🏆</p>
                <h3 className="text-xl font-bold mb-2">Best Sellers</h3>
                <p className="text-gray-700">Most popular products</p>
              </div>
              <div className="p-6 rounded-2xl shadow-lg cursor-pointer transition transform hover:scale-105 bg-gradient-to-br from-white/80 to-indigo-50" onClick={() => setCurrentPage('account')}>
                <p className="text-4xl mb-3">👤</p>
                <h3 className="text-xl font-bold mb-2">My Account</h3>
                <p className="text-gray-700">Manage your profile and orders</p>
              </div>
            </div>
          </div>

          {/* FEATURES SECTION */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">✨ Why Choose Flipzokart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-center">
                <p className="text-5xl mb-3">🚚</p>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick shipping to your doorstep</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-center">
                <p className="text-5xl mb-3">💳</p>
                <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% safe transactions</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-center">
                <p className="text-5xl mb-3">🔄</p>
                <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
                <p className="text-gray-600">Hassle-free return policy</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-center">
                <p className="text-5xl mb-3">⭐</p>
                <h3 className="text-xl font-bold mb-2">Best Quality</h3>
                <p className="text-gray-600">Premium products only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== CATEGORIES PAGE =====
  if (currentPage === 'categories') {
    const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];
    const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => (p.category || 'General') === selectedCategory);

    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-6">📂 Browse Categories</h2>
          
          <div className="flex space-x-3 mb-8 overflow-x-auto pb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-2 border-blue-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">❌ No products in this category</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <div key={p._id} className="bg-white p-4 rounded shadow-md hover:shadow-xl transition">
                  <img src={p.image} className="h-48 w-full object-contain rounded" alt={p.name} />
                  <h2 className="font-bold mt-3 text-lg truncate">{p.name}</h2>
                  <p className="text-gray-500 text-sm">{p.category || 'General'}</p>
                  <p className="text-green-600 font-bold text-xl mt-2">₹{p.price}</p>
                  <p className="text-sm text-gray-600 mb-2">Stock: {p.stock || 'Available'}</p>
                  <button onClick={() => handleAddToCart(p)} className="bg-orange-500 text-white w-full py-2 rounded font-bold hover:bg-orange-600">🛒 Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }


  // ===== CART PAGE =====
  if (currentPage === 'cart') {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <div className="p-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">❌ Cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item._id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                      <p className="text-sm text-gray-600">Qty: 
                        <input type="number" min="1" value={item.quantity} onChange={e => handleUpdateQuantity(item._id, parseInt(e.target.value))} className="w-16 ml-2 p-1 border rounded" />
                      </p>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold">🗑️ Remove</button>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-xl font-bold mb-4">Total: ₹{cartTotal}</h3>
                <button onClick={() => setCurrentPage('checkout')} disabled={cart.length === 0} className="w-full bg-blue-600 text-white py-3 font-bold rounded hover:bg-blue-700 disabled:bg-gray-500">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ===== CHECKOUT PAGE =====
  if (currentPage === 'checkout') {
    // Payment method icons
    const paymentOptions = [
      {
        value: 'COD',
        label: 'Cash on Delivery',
        icon: (
          <span className="text-2xl">💵</span>
        ),
      },
      {
        value: 'RAZORPAY',
        label: 'Razorpay',
        icon: (
          <span className="text-2xl">💳</span>
        ),
      },
    ];

    // Primary color
    const primary = 'indigo-600';
    const highlight = 'bg-indigo-50 border-indigo-600';

    return (
      <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
        <Navbar />
        <div className="max-w-2xl mx-auto w-full flex-1 pb-28 px-2 sm:px-0">
          {/* Shipping Details Card */}
          {checkoutStep === 1 && (
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-2 text-indigo-600">🚚</span>
                  <h2 className="text-2xl font-bold tracking-tight">Shipping Details</h2>
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    // Validate shipping fields
                    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || !shipping.locality || !shipping.landmark) {
                      alert('Please fill all shipping details');
                      return;
                    }
                    setCheckoutStep(2);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative">
                      <input
                        type="text"
                        id="shipping-name"
                        value={shipping.name}
                        onChange={e => setShipping({ ...shipping, name: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="name"
                      />
                      <label htmlFor="shipping-name" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Full Name</label>
                    </div>
                    {/* Phone */}
                    <div className="relative">
                      <input
                        type="tel"
                        id="shipping-phone"
                        value={shipping.phone}
                        onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="tel"
                      />
                      <label htmlFor="shipping-phone" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Phone</label>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="relative">
                    <input
                      type="text"
                      id="shipping-address"
                      value={shipping.address}
                      onChange={e => setShipping({ ...shipping, address: e.target.value })}
                      className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                      required
                      autoComplete="street-address"
                    />
                    <label htmlFor="shipping-address" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Address</label>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* City */}
                    <div className="relative">
                      <input
                        type="text"
                        id="shipping-city"
                        value={shipping.city}
                        onChange={e => setShipping({ ...shipping, city: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="address-level2"
                      />
                      <label htmlFor="shipping-city" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">City</label>
                    </div>
                    {/* Pincode */}
                    <div className="relative">
                      <input
                        type="text"
                        id="shipping-pincode"
                        value={shipping.pincode}
                        onChange={e => setShipping({ ...shipping, pincode: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="postal-code"
                      />
                      <label htmlFor="shipping-pincode" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Pincode</label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* State */}
                    <div className="relative">
                      <input
                        type="text"
                        id="shipping-state"
                        value={shipping.state}
                        onChange={e => setShipping({ ...shipping, state: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="address-level1"
                      />
                      <label htmlFor="shipping-state" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">State</label>
                    </div>
                    {/* Locality */}
                    <div className="relative">
                      <input
                        type="text"
                        id="shipping-locality"
                        value={shipping.locality}
                        onChange={e => setShipping({ ...shipping, locality: e.target.value })}
                        className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                        required
                        autoComplete="address-line2"
                      />
                      <label htmlFor="shipping-locality" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Locality</label>
                    </div>
                  </div>
                  {/* Landmark */}
                  <div className="relative">
                    <input
                      type="text"
                      id="shipping-landmark"
                      value={shipping.landmark}
                      onChange={e => setShipping({ ...shipping, landmark: e.target.value })}
                      className="peer w-full border-2 border-gray-200 rounded-lg px-4 pt-6 pb-2 focus:border-indigo-600 outline-none bg-transparent transition"
                      required
                    />
                    <label htmlFor="shipping-landmark" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-indigo-600 peer-valid:-top-3 peer-valid:text-xs bg-white px-1 pointer-events-none">Landmark</label>
                  </div>
                  <div className="h-2"></div>
                </form>
              </div>
            </div>
          )}
          {/* Payment Method Card */}
          {checkoutStep === 2 && (
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-indigo-600 text-2xl mr-2">💳</span>
                  Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {paymentOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex items-center border-2 rounded-xl px-5 py-4 w-full transition shadow-sm text-left space-x-4 focus:outline-none ${paymentMethod === opt.value ? highlight + ' ring-2 ring-indigo-200' : 'bg-gray-50 border-gray-200 hover:border-indigo-400'}`}
                      onClick={() => setPaymentMethod(opt.value)}
                    >
                      <span>{opt.icon}</span>
                      <span className="font-semibold text-lg">{opt.label}</span>
                      {paymentMethod === opt.value && (
                        <span className="ml-auto text-indigo-600 font-bold text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-3 font-bold rounded-xl text-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                  disabled={orderLoading || isRazorpayLoading}
                  onClick={async () => {
                    if (!user) {
                      alert('Please login to place an order');
                      setCurrentPage('login');
                      return;
                    }
                    
                    // Handle different payment methods
                    if (paymentMethod === 'RAZORPAY' || paymentMethod === 'CREDIT' || paymentMethod === 'DEBIT') {
                      await handleRazorpayPayment();
                    } else {
                      // Handle COD and UPI
                      setOrderLoading(true);
                      const items = cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity }));
                      const token = localStorage.getItem('token');
                      axios.post('https://flipzokart-backend.onrender.com/api/orders', { items, total: cartTotal, shipping, paymentMethod }, { headers: { Authorization: `Bearer ${token}` } })
                        .then(res => {
                          setCart([]);
                          localStorage.removeItem('cart');
                          fetchOrders();
                          setCurrentPage('thankyou');
                        })
                        .catch(err => {
                          alert('❌ Error placing order: ' + (err.response?.data?.error || err.message));
                        })
                        .finally(() => setOrderLoading(false));
                    }
                  }}
                >
                  {isRazorpayLoading ? 'Processing Payment...' : orderLoading ? 'Placing Order...' : 'Place Order'}
                </button>
                <button
                  className="w-full mt-3 bg-gray-200 text-gray-800 py-2 rounded-xl font-bold hover:bg-gray-300"
                  onClick={() => setCheckoutStep(1)}
                >
                  ← Back to Shipping
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Sticky Bottom Button */}
        {checkoutStep === 1 && (
          <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl py-4 px-4 flex justify-center z-50">
            <button
              className="w-full max-w-2xl bg-indigo-600 text-white py-3 font-bold rounded-xl text-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
              onClick={() => {
                // Validate shipping fields
                if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || !shipping.locality || !shipping.landmark) {
                  alert('Please fill all shipping details');
                  return;
                }
                setCheckoutStep(2);
              }}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    );
  }

  // ===== SHOP PAGE =====
  if (currentPage === 'shop') {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-6">🎉 All Products</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">❌ No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p._id} className="bg-white p-4 rounded shadow-md hover:shadow-xl transition">
                  <img src={p.image} className="h-48 w-full object-contain rounded" alt={p.name} />
                  <h2 className="font-bold mt-3 text-lg truncate">{p.name}</h2>
                  <p className="text-gray-500 text-sm">{p.category || 'General'}</p>
                  <p className="text-green-600 font-bold text-xl mt-2">₹{p.price}</p>
                  <button onClick={() => handleAddToCart(p)} className="bg-orange-500 text-white w-full py-2 mt-3 rounded font-bold hover:bg-orange-600">🛒 Add to Cart</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }



  if (currentPage === 'account') {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <div className="p-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">👤 My Account</h2>
          {user ? (
            <div className="bg-white p-6 rounded shadow-md">
              <p className="text-lg font-bold mb-2">Name: {user.name}</p>
              <p className="text-lg mb-2">Email: {user.email}</p>
              <p className="text-lg mb-2">Role: {user.role}</p>
              <h3 className="text-xl font-bold mt-6 mb-2">Order History</h3>
              {orders.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
              ) : (
                <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order._id} className="bg-gray-50 p-4 rounded shadow">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">Order ID: {order._id}</span>
                            <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="mb-2 flex items-center">
                            <span className="font-bold">Status:</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">{order.status}</span>
                            <span className="ml-4 font-bold">Payment:</span>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold ml-2">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Paid'}</span>
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Total:</span> ₹{order.total}
                          </div>
                          <div className="mb-2">
                            <span className="font-bold">Items:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              {order.items.map(item => (
                                <div key={item.productId} className="flex items-center bg-white border border-gray-100 rounded-lg shadow-sm p-2">
                                  <img
                                    src={item.image || '/placeholder.png'}
                                    alt={item.name}
                                    className="h-12 w-12 object-contain rounded mr-3 border"
                                  />
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{item.name}</div>
                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                    <div className="text-green-600 font-bold text-sm">₹{item.price}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {order.shipping && (
                            <div className="mt-2 text-sm text-gray-700">
                              <span className="font-bold">Shipping:</span> {`${order.shipping.address}, ${order.shipping.locality}, ${order.shipping.landmark}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}`}
                            </div>
                          )}
                        </div>
                      ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded shadow-md text-center">
              <p className="text-lg mb-4">Please login to view your account.</p>
              <button onClick={() => setCurrentPage('login')} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Login</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== ADMIN PAGE =====
  if (currentPage === 'admin') {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <Navbar />
        <div className="p-10 flex flex-col lg:flex-row gap-10">
          <div className="max-w-lg bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">➕ Add New Product</h2>
            <div className="space-y-4">
              <input placeholder="Product Name" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="Price (₹)" type="number" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <input placeholder="Image URL" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              <input placeholder="Category" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
              <input placeholder="Stock" type="number" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
              <button onClick={handleAdd} disabled={loading} className="bg-blue-600 text-white w-full py-3 font-bold rounded hover:bg-blue-700 disabled:bg-gray-500">{loading ? "⏳ Adding..." : "✅ UPLOAD PRODUCT"}</button>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">📦 All Products ({products.length})</h2>
            {products.length === 0 ? (
              <p className="text-gray-500 text-lg">No products available</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {products.map(p => (
                  <div key={p._id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{p.name}</h3>
                      <p className="text-green-600 font-bold">₹{p.price}</p>
                      <p className="text-sm text-gray-600">{p.category || 'General'} | Stock: {p.stock || 'N/A'}</p>
                    </div>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold">🗑️ Delete</button>
                  </div>
                ))}
              </div>
            )}
            
            {/* ADMIN ORDERS */}
            <div className="mt-8 bg-white p-6 rounded shadow">
              <h3 className="text-2xl font-bold mb-4">📋 Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o._id} className="border rounded p-4 flex justify-between items-start">
                      <div>
                        <p className="font-bold">Order ID: {o._id}</p>
                        <p className="text-sm text-gray-600">Placed: {new Date(o.createdAt).toLocaleString()}</p>
                        <p className="mt-2">Items:</p>
                        <ul className="list-disc list-inside text-sm">
                          {o.items.map(it => (<li key={it.productId}>{it.name} x {it.quantity} — ₹{it.price}</li>))}
                        </ul>
                        <p className="font-bold mt-2">Total: ₹{o.total}</p>
                        {o.shipping && (
                          <div className="mt-2 text-sm text-gray-700">
                            <p className="font-bold">Shipping Details:</p>
                            <p>Name: {o.shipping.name}</p>
                            <p>Phone: {o.shipping.phone}</p>
                            <p>Address: {o.shipping.address}</p>
                            <p>City: {o.shipping.city}</p>
                            <p>Pincode: {o.shipping.pincode}</p>
                            <p>Locality: {o.shipping.locality}</p>
                            <p>Landmark: {o.shipping.landmark}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold">Status: <span className="text-indigo-600">{o.status}</span></p>
                        <div className="space-x-2">
                          <button onClick={() => updateOrderStatus(o._id, 'shipped')} className="px-3 py-1 bg-yellow-400 rounded">Mark Shipped</button>
                          <button onClick={() => updateOrderStatus(o._id, 'delivered')} className="px-3 py-1 bg-green-500 text-white rounded">Mark Delivered</button>
                          <button onClick={() => updateOrderStatus(o._id, 'cancelled')} className="px-3 py-1 bg-red-500 text-white rounded">Cancel</button>
                        </div>
                        <button onClick={() => handleDeleteOrder(o._id)} className="mt-2 px-3 py-1 bg-gray-200 rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
