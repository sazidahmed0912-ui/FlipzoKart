import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  // Load initial data
  useEffect(() => {
    loadProducts();
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { email, password, name });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async (shippingDetails, paymentMethod) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: getTotalPrice(),
        shipping: shippingDetails,
        paymentMethod
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
      setCurrentPage('orders');
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('home');
  };

  // Render different pages based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={login} error={error} loading={loading} />;
      case 'signup':
        return <SignupPage onSignup={signup} error={error} loading={loading} />;
      case 'cart':
        return <CartPage cart={cart} onRemove={removeFromCart} onUpdate={updateQuantity} total={getTotalPrice()} />;
      case 'checkout':
        return <CheckoutPage cart={cart} total={getTotalPrice()} onPlaceOrder={placeOrder} loading={loading} error={error} />;
      case 'orders':
        return <OrdersPage orders={orders} />;
      case 'profile':
        return <ProfilePage user={user} onLogout={logout} />;
      default:
        return <HomePage products={products} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} cart={cart} onNavigate={setCurrentPage} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {renderPage()}
      </main>
    </div>
  );
}

// Simple component definitions (you can expand these)
const Navbar = ({ user, cart, onNavigate, onLogout }) => (
  <nav className="bg-white shadow-lg">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">Flipzokart</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-gray-800">Home</button>
          {user ? (
            <>
              <button onClick={() => onNavigate('cart')} className="text-gray-600 hover:text-gray-800">
                Cart ({cart.length})
              </button>
              <button onClick={() => onNavigate('orders')} className="text-gray-600 hover:text-gray-800">Orders</button>
              <button onClick={() => onNavigate('profile')} className="text-gray-600 hover:text-gray-800">Profile</button>
              <button onClick={onLogout} className="text-gray-600 hover:text-gray-800">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-gray-800">Login</button>
              <button onClick={() => onNavigate('signup')} className="text-gray-600 hover:text-gray-800">Signup</button>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const HomePage = ({ products, onAddToCart }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">₹{product.price}</p>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LoginPage = ({ onLogin, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const SignupPage = ({ onSignup, error, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email, password, name);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

const CartPage = ({ cart, onRemove, onUpdate, total }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
    {cart.length === 0 ? (
      <p>Your cart is empty</p>
    ) : (
      <div>
        {cart.map(item => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow mb-4">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdate(item.id, item.quantity - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => onUpdate(item.id, item.quantity + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="text-right">
          <h3 className="text-2xl font-bold">Total: ₹{total}</h3>
        </div>
      </div>
    )}
  </div>
);

const CheckoutPage = ({ cart, total, onPlaceOrder, loading, error }) => {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder(shippingDetails, paymentMethod);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Name"
              value={shippingDetails.name}
              onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
            <input 
              type="tel" 
              placeholder="Phone"
              value={shippingDetails.phone}
              onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
            <input 
              type="text" 
              placeholder="Address"
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
              className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
            <input 
              type="text" 
              placeholder="City"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
            <input 
              type="text" 
              placeholder="State"
              value={shippingDetails.state}
              onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
            <input 
              type="text" 
              placeholder="Pincode"
              value={shippingDetails.pincode}
              onChange={(e) => setShippingDetails({...shippingDetails, pincode: e.target.value})}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required 
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Razorpay (Online Payment)
            </label>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-2xl font-bold">Total: ₹{total}</h3>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

const OrdersPage = ({ orders }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Your Orders</h2>
    {orders.length === 0 ? (
      <p>You have no orders yet</p>
    ) : (
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Order #{order._id}</h3>
                <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Status: {order.status}</p>
                <p className="text-gray-600">Payment: {order.paymentMethod}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold">₹{order.total}</h3>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProfilePage = ({ user, onLogout }) => (
  <div className="max-w-md mx-auto">
    <h2 className="text-3xl font-bold mb-6">Profile</h2>
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Name:</label>
          <p>{user?.name}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Email:</label>
          <p>{user?.email}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Role:</label>
          <p>{user?.role}</p>
        </div>
      </div>
      <button 
        onClick={onLogout}
        className="w-full mt-6 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
);

export default App;
