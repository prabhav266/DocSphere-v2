import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Bell, Shield, Palette, Globe, CreditCard, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      await updateProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user?.username
    ? user.username.trim().split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()
    : '??';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            <SettingsLink icon={<User className="h-4 w-4" />} label="Profile" active />
            <SettingsLink icon={<Bell className="h-4 w-4" />} label="Notifications" />
            <SettingsLink icon={<Shield className="h-4 w-4" />} label="Security" />
            <SettingsLink icon={<Palette className="h-4 w-4" />} label="Appearance" />
            <SettingsLink icon={<Globe className="h-4 w-4" />} label="Language" />
            <SettingsLink icon={<CreditCard className="h-4 w-4" />} label="Billing" />
          </nav>
        </aside>

        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-2xl border-4 border-white dark:border-slate-800 shadow-sm">
                  {initials}
                </div>
                <div>
                  <Button variant="secondary" size="sm" disabled>Change Avatar</Button>
                  <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <Input
                label="Bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </CardContent>
            <CardFooter className="justify-end bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-100 dark:border-slate-800 gap-4">
              {saveError && (
                <span className="text-sm text-red-600 mr-auto">{saveError}</span>
              )}
              {isSaved && (
                <span className="text-sm text-green-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Changes saved
                </span>
              )}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          {/* Theme Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-slate-500">Toggle between light and dark theme.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Log out securely from the current session and return to the admin gate.
                </p>
                <Button variant="danger" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon, label, active }) => (
  <button className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    active
      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
  }`}>
    {icon}
    {label}
  </button>
);

export default Settings;
