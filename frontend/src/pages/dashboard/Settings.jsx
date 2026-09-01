import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { User, Bell, Shield, Palette, CheckCircle2, Lock, Moon, Sun, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [docUploadAlerts, setDocUploadAlerts] = useState(true);

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
    : 'DS';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-app-text tracking-tight">Account Settings</h1>
        <p className="text-xs text-app-muted mt-1">Manage your profile, security options, and application preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1.5 bg-app-surface p-2 rounded-2xl border border-app-border">
            <SettingsTabLink 
              icon={<User className="h-4 w-4" />} 
              label="Profile" 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
            <SettingsTabLink 
              icon={<Palette className="h-4 w-4" />} 
              label="Appearance" 
              active={activeTab === 'appearance'} 
              onClick={() => setActiveTab('appearance')} 
            />
            <SettingsTabLink 
              icon={<Bell className="h-4 w-4" />} 
              label="Notifications" 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
            />
            <SettingsTabLink 
              icon={<Shield className="h-4 w-4" />} 
              label="Security & Account" 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')} 
            />
          </nav>
        </aside>

        <div className="md:col-span-3 space-y-6">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <Card className="shadow-xs border-app-border">
              <CardHeader className="border-b border-app-border">
                <CardTitle className="text-base font-bold">Public Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md ring-4 ring-primary-500/20">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-app-text">{user?.username || 'User'}</h3>
                    <p className="text-xs text-app-muted">{user?.email}</p>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-500/10 px-2 py-0.5 rounded-md mt-1.5">
                      Role: {user?.role || 'User'}
                    </span>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-app-text">Bio / Description</label>
                  <textarea
                    className="flex w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-xs text-app-text placeholder:text-app-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between bg-app-surface-muted/60 rounded-b-xl border-t border-app-border gap-4">
                <div>
                  {saveError && <span className="text-xs text-rose-500 font-semibold">{saveError}</span>}
                  {isSaved && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Changes saved
                    </span>
                  )}
                </div>
                <Button onClick={handleSave} disabled={isSaving} size="sm" className="font-bold text-xs">
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Tab 2: Appearance */}
          {activeTab === 'appearance' && (
            <Card className="shadow-xs border-app-border">
              <CardHeader className="border-b border-app-border">
                <CardTitle className="text-base font-bold">Theme & Appearance</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 bg-app-surface-muted/60 rounded-2xl border border-app-border">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="h-5 w-5 text-indigo-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
                    <div>
                      <p className="font-bold text-sm text-app-text">Interface Theme</p>
                      <p className="text-xs text-app-muted">Switch between dark mode and light mode.</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${theme === 'dark' ? 'bg-primary-600' : 'bg-app-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <Card className="shadow-xs border-app-border">
              <CardHeader className="border-b border-app-border">
                <CardTitle className="text-base font-bold">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-app-surface-muted/60 rounded-2xl border border-app-border">
                  <div>
                    <p className="font-bold text-sm text-app-text">Email Digest Notifications</p>
                    <p className="text-xs text-app-muted">Receive weekly summaries of uploaded files and system updates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-app-surface-muted/60 rounded-2xl border border-app-border">
                  <div>
                    <p className="font-bold text-sm text-app-text">Document Review Alerts</p>
                    <p className="text-xs text-app-muted">Get notified when an admin approves or reviews your uploaded document.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={docUploadAlerts}
                    onChange={(e) => setDocUploadAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab 4: Security & Account */}
          {activeTab === 'security' && (
            <Card className="shadow-xs border-app-border">
              <CardHeader className="border-b border-app-border">
                <CardTitle className="text-base font-bold">Account & Security</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 rounded-2xl bg-app-surface-muted/60 border border-app-border flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-app-text">Password & Authentication</p>
                    <p className="text-xs text-app-muted">Your account uses standard JWT token authentication.</p>
                  </div>
                  <Button variant="secondary" size="sm" disabled className="text-xs">
                    Change Password
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                    <Lock className="h-4 w-4" /> End Current Session
                  </div>
                  <p className="text-xs text-app-muted">
                    Logout securely from this device session.
                  </p>
                  <Button variant="danger" size="sm" onClick={handleLogout} className="text-xs font-bold">
                    Logout of DocSphere
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsTabLink = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer w-full text-left ${
      active
        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-2xs'
        : 'text-app-muted hover:bg-app-surface-muted hover:text-app-text'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Settings;
