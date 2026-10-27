import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';
import AuthShell from '../../components/AuthShell.jsx';
import { Avatar } from '../../components/ui.jsx';
import { loginSchema } from '../../utils/validators.js';
import { homeRoute } from '../../utils/roles.js';

// [label, role hint, email, password, test id]
const SEED_ACCOUNTS = [
  ['Maria Santos', 'Patient', 'maria@example.com', 'Patient123!', 'patient@1'],
  ['Jose Reyes', 'Patient', 'jose@example.com', 'Patient123!', 'patient@2'],
  ['Dr. Ana Cruz', 'Doctor', 'doctor@example.com', 'Doctor123!', 'doctor'],
  ['Liza Bautista', 'Clinic staff', 'staff@example.com', 'Staff123!', 'clinic staff'],
  ['System admin', 'Administrator', 'admin@example.com', 'Admin123!', 'system admin'],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState('');
  const [show, setShow] = useState(false);
  const { register, handleSubmit, setValue, setFocus, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    setApiError('');
    try {
      const session = await login(values.email, values.password);
      navigate(location.state?.from || homeRoute(session.user.role), { replace: true });
    } catch (error) { setApiError(error.message); }
  };

  return (
    <AuthShell headline="Welcome back to your care team." text="Sign in to book visits, join your video consultation and keep your records in one private place.">
      <div className="auth-heading"><h2>Sign in</h2><p>Enter your details to continue.</p></div>
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label className="label" htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@example.com" className="input" aria-invalid={Boolean(errors.email)} data-testid="login-email" {...register('email')} />
          {errors.email && <p className="form-error" data-testid="login-error-email">{errors.email.message}</p>}
        </div>
        <div className="field">
          <label className="label" htmlFor="password">Password</label>
          <div className="input-wrap">
            <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="input" aria-invalid={Boolean(errors.password)} data-testid="login-password" {...register('password')} />
            <button type="button" className="input-icon" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((v) => !v)}>{show ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}</button>
          </div>
          {errors.password && <p className="form-error" data-testid="login-error-password">{errors.password.message}</p>}
        </div>
        {apiError && <p className="form-error banner-inline" role="alert" data-testid="login-error">{apiError}</p>}
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting} data-testid="login-submit">{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">New to MediLynk? <Link to="/register" data-testid="go-register">Create a patient account</Link></p>

      <section className="demo-accounts" aria-label="Demo accounts">
        <h3>Just exploring? Pick a demo account</h3>
        <p>Fills in the sign-in details. Everything here is sample data.</p>
        <ul>
          {SEED_ACCOUNTS.map(([name, role, email, password, testLabel]) => (
            <li key={email}>
              <button type="button" className="demo-account" data-testid={`seed-${testLabel.replace(/[^a-z0-9]/gi, '-')}`} onClick={() => { setValue('email', email, { shouldValidate: false }); setValue('password', password, { shouldValidate: false }); setFocus('password'); }}>
                <Avatar name={name} size="sm" />
                <span><strong>{name}</strong><small>{role}</small></span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </AuthShell>
  );
}
