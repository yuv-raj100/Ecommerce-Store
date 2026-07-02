import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from './reducers/CartSlice';

const ShoppingAgent = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your NEXGEN Shopping Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const server_url = process.env.REACT_APP_SERVER_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the backend (excluding the very first welcome message if we want, or map it)
      const history = newMessages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text || '' }]
      }));

      // Get user info for cart actions
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const userEmail = userInfo ? userInfo.email : null;

      const response = await fetch(`${server_url}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          history: history.slice(0, -1),
          email: userEmail 
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: data.text,
        products: data.products 
      }]);

      // If the agent successfully added a product to the cart, update Redux
      if (data.addedToCart) {
        dispatch(addItem({
          pageData: data.addedToCart.pageData,
          count: parseInt(data.addedToCart.count),
          size: data.addedToCart.size
        }));
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
          style={{ width: '90vw', maxWidth: '400px', height: '500px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h3 className="font-semibold text-lg">NEXGEN Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-md">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`rounded-2xl p-3 ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                
                {/* Render Products if any */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 w-full space-y-2">
                    {msg.products.map(product => {
                      // Format category for URL based on specific rules
                      let categorySlug = '';
                      const catLower = product.category?.toLowerCase() || '';
                      if (catLower.includes('hoddie') || catLower.includes('sweatshirt')) {
                        categorySlug = 'hoddie-and-sweatshirt';
                      } else if (catLower === 'oversized t-shirt' || catLower.includes('oversized')) {
                        categorySlug = 'oversized-t-shirt';
                      } else if (catLower === 'cargo') {
                        categorySlug = 'cargo';
                      } else {
                        categorySlug = catLower.replace(/\\s+/g, '-'); // Fallback
                      }

                      return (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-2 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                          {product.images && (
                            <img src={product.images} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-blue-600 font-bold">₹{product.price}</p>
                            <Link 
                              to={`/products/${categorySlug}/${product.handle}`} 
                              className="text-xs text-gray-500 hover:text-blue-600 hover:underline"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-2xl p-3 rounded-tl-none animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingAgent;
