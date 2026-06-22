import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 w-full">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-primary-600" />
            <span>DocSphere</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Check your email</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  We've sent a password reset link to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)} className="w-full">
                  Resend Email
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/login" className="text-sm text-slate-600 hover:text-primary-600 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
