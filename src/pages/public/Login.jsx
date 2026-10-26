import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../auth/AuthContext.jsx';
import { logoLockup } from '../../utils/brandAssets.js';
import { loginSchema } from '../../utils/validators.js';
import { homeRoute } from '../../utils/roles.js';

const SEED_ACCOUNTS = [
  ['Patient account', 'maria@example.com', 'Patient123!', 'patient@1'],
  ['Patient account', 'jose@example.com', 'Patient123!', 'patient@2'],
  ['Doctor account', 'doctor@example.com', 'Doctor123!', 'doctor'],
  ['Clinic staff', 'staff@example.com', 'Staff123!', 'clinic staff'],
  ['System admin', 'admin@example.com', 'Admin123!', 'system admin'],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const onSubmit = async (values) => {
    setApiError('');
    try {
      const session = await login(values.email, values.password);
      navigate(location.state?.from || homeRoute(session.user.role), { replace: true });
    } catch (error) { setApiError(error.message); }
  };
  return <main className="auth-screen">
    <section className="auth-story">
      <Link to="/login" className="auth-brand"><img className="brand-lockup-img" src={logoLockup} alt="MediLynk" /></Link>
      <div className="auth-story-content"><h1>Your health,<br />closer to home.</h1><p>Book a visit, talk to your care team, and keep your health journey in one secure place.</p></div>
    </section>
    <section className="auth-main"><div className="auth-form-wrap">
      <div className="auth-mobile-brand"><img className="brand-lockup-img" src={logoLockup} alt="MediLynk" /></div>
      <div className="auth-heading"><h2>Sign in to your account</h2><p>Enter your details to continue to your care dashboard.</p></div>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div><label className="label" htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" placeholder="you@example.com" className="input" data-testid="login-email" {...register('email')} />{errors.email && <p className="error" data-testid="login-error-email">{errors.email.message}</p>}</div>
        <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" className="input" data-testid="login-password" {...register('password')} />{errors.password && <p className="error" data-testid="login-error-password">{errors.password.message}</p>}</div>
        {apiError && <p className="auth-error" role="alert" data-testid="login-error">{apiError}</p>}
        <button type="submit" className="btn-primary auth-submit" disabled={isSubmitting} data-testid="login-submit">{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">New to MediLynk? <Link to="/register" data-testid="go-register">Create a patient account</Link></p>
      <div className="seed-section"><div className="seed-heading"><div><h3>Explore a demo account</h3><p>Choose a role to fill in sample sign-in details.</p></div></div>
        <ul className="seed-list">{SEED_ACCOUNTS.map(([label, email, password, testLabel]) => <li key={email}><button type="button" className="seed-account" data-testid={`seed-${testLabel.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => { setValue('email', email); setValue('password', password); }}><span className="seed-avatar">{label === 'Patient account' ? 'P' : label === 'Doctor account' ? 'D' : label === 'Clinic staff' ? 'C' : 'A'}</span><span className="seed-copy"><strong>{label}</strong><small>{email}</small></span></button></li>)}</ul>
      </div><p className="auth-legal">MediLynk demo environment · Sample accounts use synthetic data.</p>
    </div></section>
  </main>;
}
