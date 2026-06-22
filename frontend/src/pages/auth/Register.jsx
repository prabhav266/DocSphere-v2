import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please check your connection to the server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-primary-600" />
            <span>DocSphere</span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create your account to start managing documents.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* Password Strength Indicator */}
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      strength >= i ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Password Strength</p>

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
                required
              />

              <div className="flex items-start gap-2 pt-2">
                <input type="checkbox" id="terms" className="mt-1 rounded border-slate-300 text-primary-600 focus:ring-primary-500" required />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  I agree to the <Link to="/" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link to="/" className="text-primary-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
