"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronDown, ChevronUp, Send } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Pre-built questions and answers
  const faqDatabase = {
    "What services do you offer?": "We offer tutoring, homework help, and assignment completion services in various subjects including math, science, programming, and humanities.",
    "How does Preply work?": "Preply connects you with expert tutors who can help with your coursework. You can submit your requirements, get matched with a tutor, and receive personalized help through our platform.",
    "What are your pricing plans?": "Our pricing varies based on the type of service, subject complexity, and deadline. You can get a custom quote by submitting your assignment details through our form.",
    "Can I get help with urgent assignments?": "Yes, we offer urgent assignment services with fast turnaround times. Additional fees may apply for rush orders.",
    "How do I find the right tutor?": "Our platform matches you with tutors based on your subject needs, academic level, and learning style. You can also browse tutor profiles and reviews to make your selection.",
    "Is my personal information secure?": "Absolutely! We take data security seriously and follow strict privacy policies to ensure your personal information is protected.",
    "Can I get a refund if I'm not satisfied?": "Yes, we offer a satisfaction guarantee. If you're not happy with the service, you can request a revision or a refund according to our policy.",
    "How do I submit my assignment?": "You can submit your assignment details through our requirements form. Once submitted, we'll match you with a suitable tutor."
  };

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message
    setMessages([...messages, { sender: 'user', text: inputText }]);
    
    // Clear input and show typing indicator
    setInputText('');
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Can you please be more specific or ask another question?";
      
      // Check if the user's message matches any FAQ
      const userQuestion = inputText.trim().toLowerCase();
      
      for (const [question, answer] of Object.entries(faqDatabase)) {
        if (userQuestion.includes(question.toLowerCase()) || 
            question.toLowerCase().includes(userQuestion)) {
          botResponse = answer;
          break;
        }
      }
      
      // Add bot response and remove typing indicator
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="flex items-center justify-center bg-at-button-light hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-at-button-light text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">Preply Chat Assistant</h3>
            <button onClick={toggleChat} className="text-white">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 min-h-64">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-at-button-light text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg rounded-bl-none">
                    <span className="flex space-x-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Common questions */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Common questions:</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.keys(faqDatabase).slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  className="bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded-md text-gray-700"
                  onClick={() => {
                    setMessages([...messages, { sender: 'user', text: question }]);
                    
                    // Simulate typing
                    setIsTyping(true);
                    setTimeout(() => {
                      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: faqDatabase[question] }]);
                      setIsTyping(false);
                    }, 1000);
                  }}
                >
                  {question.length > 20 ? question.substring(0, 20) + '...' : question}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 flex">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 outline-none text-sm text-black"
            />
            <button 
              type="submit" 
              disabled={inputText.trim() === ''}
              className={`p-2 rounded ${
                inputText.trim() === '' 
                  ? 'text-gray-400' 
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;