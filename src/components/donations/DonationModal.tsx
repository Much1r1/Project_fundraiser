import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, Lock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationModalProps {
  campaign: {
    id: string;
    title: string;
    creator: { name: string };
  };
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ campaign, onClose }) => {
  const [amount, setAmount] = useState(25);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'paypal'>('card');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount');

  const presetAmounts = [10, 25, 50, 100, 250];

  const handleDonate = () => {
    // Simulate payment processing
    setStep('payment');
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 'success' ? 'Thank You!' : 'Make a Donation'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {step === 'amount' && (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {campaign.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  By {campaign.creator.name}
                </p>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        amount === preset
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter custom amount"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-emerald-600"
                    />
                    <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-emerald-600"
                    />
                    <Smartphone className="h-5 w-5 ml-3 mr-2 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">M-Pesa</span>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-emerald-600"
                    />
                    <Banknote className="h-5 w-5 ml-3 mr-2 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-white">PayPal</span>
                  </label>
                </div>
              </div>

              {/* Optional Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message of support..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Anonymous Option */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="text-emerald-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Donate anonymously
                  </span>
                </label>
              </div>

              {/* Security Notice */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Lock className="h-4 w-4 mr-2" />
                  Your payment information is secure and encrypted.
                </div>
              </div>

              <button
                onClick={handleDonate}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Donate ${amount}
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Processing Payment
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we process your donation...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6 text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Thank you for your donation!
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your ${amount} donation to "{campaign.title}" has been processed successfully.
              </p>
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Continue
                </button>
                <button className="w-full text-emerald-600 dark:text-emerald-400 py-2 px-4 border border-emerald-600 dark:border-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors">
                  Share Your Donation
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DonationModal;