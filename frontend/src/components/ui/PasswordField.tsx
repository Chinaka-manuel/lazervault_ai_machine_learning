import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

interface PasswordFieldProps {
  register?: any;
  name?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  validation?: any;
  className?: string;
  icon?: boolean;
}

const PasswordField = ({
  register,
  name = 'password',
  label = 'Password',
  placeholder = '••••••••',
  error,
  autoComplete = 'current-password',
  validation,
  className = '',
  icon = true,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {label && <label className="mb-1 block text-sm font-medium">{label}</label>}
      <div className="relative">
        {icon && <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          className={`input ${icon ? 'pl-10' : ''} pr-10`}
          placeholder={placeholder}
          {...register(name, validation)}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordField;
