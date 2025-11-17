import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const OTP_LENGTH = 6;

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyEmail } = useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [result, setResult] = useState({ type: '', msg: '' });
  const [verified, setVerified] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  const email = user?.email;

  const sendVerification = async () => {
    try {
      await authService.sendVerification(email);
      setResult({ type: 'info', msg: 'Code sent. Check your email.' });
      startTimer();
    } catch (err) {
      setResult({ type: 'error', msg: err.message });
    }
  };

  const startTimer = () => {
    setCountdown(30);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOTPChange = (value, index) => {
    if (isNaN(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d+$/.test(paste) && paste.length === OTP_LENGTH) {
      const arr = paste.split('');
      setOtp(arr);
      arr.forEach((d, i) => (inputRefs.current[i].value = d));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) {
      setResult({ type: 'error', msg: 'Enter the full 6-digit code.' });
      return;
    }

    setLoading(true);
    setResult({ type: '', msg: '' });

    try {
      const res = await verifyEmail(email, code);
      setVerified(true);
      setResult({ type: 'success', msg: 'Email verified successfully! Welcome to Zippy Pay.' });
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (err) {
      setResult({ type: 'error', msg: err.message || 'Invalid or expired code.' });
      resetOtpInputs();
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setResendLoading(true);
    try {
      await authService.sendVerification(email);
      setResult({ type: 'info', msg: 'New verification code sent.' });
      resetOtpInputs();
      startTimer();
    } catch (err) {
      setResult({ type: 'error', msg: err.message });
    } finally {
      setResendLoading(false);
    }
  };

  const resetOtpInputs = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current.forEach(ref => ref && (ref.value = ''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">

        {verified ? (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Email Verified</h2>
            <p className="text-gray-600">{result.msg}</p>
          </>
        ) : (
          <>
            <Mail className="mx-auto h-16 w-16 text-indigo-700 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h2>
            <p className="text-gray-600">Enter the 6-digit code sent to <strong>{email}</strong></p>

            {result.msg && (
              <div
                className={`mt-4 p-3 text-sm rounded ${
                  result.type === 'error'
                    ? 'bg-red-100 text-red-700'
                    : result.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {result.msg}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-6" onPaste={handlePaste}>
              {otp.map((val, index) => (
                <input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={e => handleOTPChange(e.target.value, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="w-12 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold tracking-wide focus:ring-2 focus:ring-indigo-700 outline-none"
                />
              ))}
            </div>

            <button
              onClick={verifyCode}
              disabled={loading || otp.join('').length !== OTP_LENGTH}
              className="w-full mt-6 bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Verify'}
            </button>

            {countdown > 0 ? (
              <p className="text-gray-500 text-sm mt-3">Resend in {countdown}s</p>
            ) : (
              <button
                disabled={resendLoading}
                onClick={resendCode}
                className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded py-2 font-semibold disabled:opacity-50"
              >
                {resendLoading ? <LoadingSpinner size="sm" /> : 'Resend Code'}
              </button>
            )}

       
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
