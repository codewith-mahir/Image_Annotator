import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import useAuthStore from '../store/useAuthStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post('/auth/register', form);
      setAuth(response.data.user, response.data.token);
      navigate('/app');
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        submitError.response?.data?.errors?.[0]?.msg ||
        'Failed to register.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Set up access for the annotation workspace</p>

        {error && <p className="message error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
