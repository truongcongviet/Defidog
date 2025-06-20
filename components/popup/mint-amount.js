import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MintAmountPopup = ({ isOpen, onClose, onMint }) => {
  const [amount, setAmount] = useState('1');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Allow empty string for typing, but only numbers
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 1 && val.startsWith('0')) {
      val = val.replace(/^0+/, ''); // Remove leading zeros
    }
    if (val === '') {
      setAmount('');
    } else {
      setAmount(val);
    }
    setError('');
  };

  const handleMint = () => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || amount === '' || num < 1) {
      setError('Amount must be at least 1');
      return;
    }
    if (num > 5) {
      setError('Max amount is 5');
      return;
    }
    setError('');
    onMint(num);
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="rounded-2xl shadow-2xl px-6 pt-8 pb-6 w-full max-w-sm relative border border-blue-100"
            style={{
              background: 'radial-gradient(ellipse at 60% 40%, #7f9cf5 0%, #a78bfa 40%, #c4b5fd 100%)',
              boxShadow: '0 10px 32px 0 rgba(80, 80, 180, 0.15)',
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-700 text-3xl font-bold focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            {/* Decorative Icon */}
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-tr from-blue-500 via-purple-500 to-indigo-500 rounded-full p-2 shadow-lg">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10Zm0 18c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8 4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8Zm0-14a6 6 0 1 0 0 12A6 6 0 0 0 12 6Z"/></svg>
              </div>
            </div>
            {/* Gradient Header */}
            <h2 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-tight">Mint NFT</h2>
            <p className="mb-5 text-center text-gray-600">Please choose the amount of NFTs you want to mint</p>
            {/* Numeric Stepper */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                className="w-8 h-8 rounded-full bg-gray-100 text-2xl text-blue-700 hover:bg-blue-100 focus:outline-none"
                onClick={() => setAmount(prev => (parseInt(prev || '1', 10) > 1 ? (parseInt(prev, 10) - 1).toString() : '1'))}
                aria-label="Decrease"
                type="button"
              >
                –
              </button>
              <input
                type="number"
                min="1"
                max="5"
                value={amount}
                onChange={handleChange}
                className="w-16 px-2 py-2 border border-blue-200 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-blue-500 transition"
              />
              <button
                className="w-8 h-8 rounded-full bg-gray-100 text-2xl text-blue-700 hover:bg-blue-100 focus:outline-none"
                onClick={() => setAmount(prev => (parseInt(prev || '1', 10) < 5 ? (parseInt(prev || '1', 10) + 1).toString() : '5'))}
                aria-label="Increase"
                type="button"
              >
                +
              </button>
            </div>
            {error && <div className="text-red-500 text-sm mb-2 text-center font-medium animate-pulse">{error}</div>}
            <div className="flex gap-3 mt-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#003fdd] to-[#000d9f] text-white font-semibold hover:opacity-90 transition"
                onClick={handleMint}
                type="button"
              >
                Mint
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MintAmountPopup;
