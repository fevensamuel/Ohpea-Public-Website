import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface OtpInputProps {
  phone: string;
  onVerify: (code: string) => Promise<boolean> | boolean;
  onResend: () => Promise<void> | void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ phone, onVerify, onResend }) => {
  const { t } = useTranslation();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);
    setError(null);

    // Auto-advance
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when 6 digits are filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleComplete(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split('');
      setDigits(arr);
      inputsRef.current[5]?.focus();
      handleComplete(pasted);
    }
  };

  const handleComplete = async (code: string) => {
    setVerifying(true);
    setError(null);
    try {
      const ok = await onVerify(code);
      if (!ok) {
        setError(t('otp.incorrect'));
      }
    } catch (err: any) {
      setError(err?.message || t('otp.failed'));
    } finally {
      setVerifying(false);
    }
  };

  const handleResendClick = async () => {
    if (timer > 0) return;
    setDigits(['', '', '', '', '', '']);
    setTimer(60);
    setError(null);
    await onResend();
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm text-center">
      <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
        {t('otp.title')}
      </h3>
      <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
        {t('otp.desc')}{' '}
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
          {phone}
        </span>
      </p>

      {/* 6 Digit Inputs */}
      <div className="flex justify-center gap-2 sm:gap-3 my-6" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-950/50 outline-none transition-all text-stone-900 dark:text-stone-100"
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-4">
          {error}
        </p>
      )}

      {/* Resend Timer */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
        {timer > 0 ? (
          <span>{t('otp.resendIn')} <strong className="text-stone-700 dark:text-stone-300">{timer}s</strong></span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('otp.resendButton')}
          </button>
        )}
      </div>
    </div>
  );
};
