import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../auth/AuthContext.jsx';
import { registrationSchema } from '../../utils/validators.js';
import { logoLockup } from '../../utils/brandAssets.js';

const FIELDS = [
  ['name', 'Full name', 'text', 'e.g. Maria Santos', 'name'],
  ['email', 'Email address', 'email', 'name@example.com', 'email'],
  ['phone', 'Mobile number', 'tel', '09XXXXXXXXX or +639XXXXXXXXX', 'tel'],
  ['birthdate', 'Birthdate', 'date', '', 'bday'],
  ['address', 'Home address', 'text', 'City, province', 'street-address'],
  ['password', 'Password', 'password', 'At least 8 characters', 'new-password'],
  ['confirmPassword', 'Confirm password', 'password', 'Re-enter your password', 'new-password'],
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
  return <main className="auth-screen">
    <section className="auth-story register-story"><Link to="/login" className="auth-brand"><img className="brand-lockup-img" src={logoLockup} alt="MediLynk" /></Link><div className="auth-story-content"><h1>Take the next<br />step in your care.</h1><p>Create your account to manage appointments, connect with your doctor, and keep your health details together.</p></div></section>
    <section className="auth-main"><div className="auth-form-wrap register-form-wrap"><div className="auth-mobile-brand"><img className="brand-lockup-img" src={logoLockup} alt="MediLynk" /></div><div className="auth-heading"><h2>Create your patient account</h2><p>Set up your details to start managing your care.</p></div>
      <form className="auth-form register-form" onSubmit={handleSubmit(onSubmit)} noValidate>{FIELDS.map(([name, label, type, placeholder, autoComplete]) => <div key={name} className={name === 'address' ? 'register-wide' : ''}><label className="label" htmlFor={name}>{label}</label><input id={name} type={type} autoComplete={autoComplete} placeholder={placeholder} className="input" data-testid={`register-${name}`} {...register(name)} />{errors[name] && <p className="error" data-testid={`register-error-${name}`}>{errors[name].message}</p>}</div>)}
        {apiError && <p className="auth-error register-wide" role="alert" data-testid="register-error">{apiError}</p>}<div className="register-actions register-wide"><button type="submit" className="btn-primary auth-submit" disabled={isSubmitting} data-testid="register-submit">{isSubmitting ? 'Creating account…' : 'Create account'}</button><p>Already have an account? <Link to="/login" data-testid="go-login">Sign in</Link></p></div>
      </form><p className="auth-legal">By creating an account, you agree to keep your sign-in details private.</p>
    </div></section>
  </main>;
}
