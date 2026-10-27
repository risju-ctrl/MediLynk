import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../auth/AuthContext.jsx';
import AuthShell from '../../components/AuthShell.jsx';
import { registrationSchema } from '../../utils/validators.js';

const FIELDS = [
  ['name', 'Full name', 'text', 'Maria Santos', 'name'],
  ['email', 'Email address', 'email', 'name@example.com', 'email'],
  ['phone', 'Mobile number', 'tel', '09XXXXXXXXX or +639XXXXXXXXX', 'tel'],
  ['birthdate', 'Birthdate', 'date', '', 'bday'],
  ['address', 'Home address', 'text', 'City, province', 'street-address'],
  ['password', 'Password', 'password', '8 or more characters', 'new-password'],
  ['confirmPassword', 'Confirm password', 'password', 'Type it again', 'new-password'],
];

export default function Register() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registrationSchema) });

  const onSubmit = async ({ confirmPassword, ...values }) => {
    setApiError('');
    try { await registerAccount(values); navigate('/patient', { replace: true }); }
    catch (error) { setApiError(error.message); }
  };

  return (
    <AuthShell wide headline="Start with a free patient account." text="Book your first video consultation in minutes. Your details stay private to you and your care team.">
      <div className="auth-heading"><h2>Create your account</h2><p>It takes about a minute.</p></div>
      <form className="form form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
        {FIELDS.map(([name, label, type, placeholder, autoComplete]) => (
          <div key={name} className={`field${name === 'address' ? ' span-2' : ''}`}>
            <label className="label" htmlFor={name}>{label}</label>
            <input id={name} type={type} autoComplete={autoComplete} placeholder={placeholder} className="input" aria-invalid={Boolean(errors[name])} data-testid={`register-${name}`} {...register(name)} />
            {errors[name] && <p className="form-error" data-testid={`register-error-${name}`}>{errors[name].message}</p>}
          </div>
        ))}
        {apiError && <p className="form-error banner-inline span-2" role="alert" data-testid="register-error">{apiError}</p>}
        <div className="span-2 stack-tight">
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting} data-testid="register-submit">{isSubmitting ? 'Creating account…' : 'Create account'}</button>
          <p className="auth-switch center">Already have an account? <Link to="/login" data-testid="go-login">Sign in</Link></p>
        </div>
      </form>
      <p className="fine-print center">Demo environment: your account lives in this browser only and resets on reload.</p>
    </AuthShell>
  );
}
