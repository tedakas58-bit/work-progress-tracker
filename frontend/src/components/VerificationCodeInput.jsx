import React, { useState, useRef, useEffect } from 'react';
import { Mail, RefreshCw, Shield } from 'lucide-react';

const VerificationCodeInput = ({ onVerify, onResend, loading, email }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newCode.every(digit => digit !== '')) {
      onVerify(newCode.join(''));
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    await onResend();
    setResendLoading(false);
    setTimeLeft(600); // Reset timer
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedEmail = email ? 
    email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 
    '***@***.com';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 animate-slide-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Required</h1>
            <p className="text-purple-200 text-sm">
              We've sent a 6-digit code to
            </p>
            <p className="text-white font-medium">{maskedEmail}</p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-purple-200 mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex justify-center space-x-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm"
                  disabled={loading}
                />
              ))}
            </div>
            
            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-purple-200">
                Code expires in: <span className="font-mono font-bold text-white">{formatTime(timeLeft)}</span>
              </p>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => onVerify(code.join(''))}
            disabled={loading || code.join('').length !== 6}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg mb-4"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Shield size={20} />
                <span>Verify Code</span>
              </>
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-purple-200 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendLoading || timeLeft > 540} // Allow resend after 1 minute
              className="flex items-center justify-center space-x-2 text-purple-300 hover:text-white transition disabled:opacity-50 mx-auto"
            >
              {resendLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-300"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Resend Code</span>
                </>
              )}
            </button>
            {timeLeft > 540 && (
              <p className="text-xs text-purple-300 mt-1">
                Available in {formatTime(600 - timeLeft)}
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-start space-x-2">
              <Mail size={16} className="text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Check your email</p>
                <p>The code might take a few minutes to arrive. Check your spam folder if you don't see it.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;