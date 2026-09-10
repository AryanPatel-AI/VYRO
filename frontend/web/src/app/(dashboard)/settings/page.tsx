'use client';
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usersApi } from '@/lib/api';

const TABS = ['Profile', 'AI Preferences', 'Notifications', 'Billing'];

export default function SettingsPage() {
  const [tab, setTab] = useState('Profile');
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    usersApi.getMe().then((res) => setUser(res.data)).catch(console.error);
  }, []);

  const handleAiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await usersApi.updateMe({
        defaultAiProvider: user.defaultAiProvider,
        geminiApiKey: user.geminiApiKey,
        anthropicApiKey: user.anthropicApiKey,
      });
      alert('AI configuration saved successfully.');
    } catch (error) {
      console.error(error);
      alert('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="flex gap-1 p-1 bg-[hsl(var(--bg-elevated))] rounded-xl border border-[hsl(var(--bg-border))] w-fit">
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all',tab===t?'bg-gradient-to-r from-[hsl(var(--vyro-purple))] to-[hsl(var(--vyro-pink))] text-white':'text-[hsl(var(--text-secondary))] hover:text-white')}>{t}</button>)}
      </div>
      {tab==='Profile'&&(
        <div className="card space-y-6">
          <h2 className="font-semibold">Creator Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            {[{label:'Full Name',ph:'Aryan Patel'},{label:'Email',ph:'aryan@vyro.app'},{label:'Niche',ph:'Tech + Smartphones'},{label:'Location',ph:'Mumbai, India'}].map(f=>(
              <div key={f.label}>
                <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">{f.label}</label>
                <input className="input" defaultValue={f.ph}/>
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Bio</label>
              <textarea className="input min-h-[80px] resize-none" defaultValue="Tech creator covering smartphones, cameras, and productivity. Based in Mumbai."/>
            </div>
          </div>
          <button className="btn-primary"><Save className="w-4 h-4"/>Save Changes</button>
        </div>
      )}
      {tab === 'AI Preferences' && (
        <div className="card space-y-4">
          <h2 className="font-semibold">AI Configuration</h2>
          <p className="text-sm text-[hsl(var(--text-muted))]">VYRO supports multiple AI providers for managing your content and deals. Configure your keys below.</p>
          
          <form onSubmit={handleSaveAiConfig} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Default AI Provider</label>
              <select className="input" name="defaultAiProvider" value={user?.defaultAiProvider || 'GEMINI'} onChange={handleAiChange}>
                <option value="GEMINI">Google Gemini (Default)</option>
                <option value="CLAUDE">Anthropic Claude</option>
              </select>
            </div>
            
            <div className="pt-4 border-t border-[hsl(var(--bg-border))]">
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Google Gemini API Key</label>
              <input type="password" name="geminiApiKey" value={user?.geminiApiKey || ''} onChange={handleAiChange} className="input" placeholder="AIzaSy..." />
            </div>

            <div className="pt-4 border-t border-[hsl(var(--bg-border))]">
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Anthropic Claude API Key</label>
              <input type="password" name="anthropicApiKey" value={user?.anthropicApiKey || ''} onChange={handleAiChange} className="input" placeholder="sk-ant-..." />
            </div>
            
            <button type="submit" className="btn-primary mt-4" disabled={isSaving}>
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      )}
      {(tab==='Notifications'||tab==='Billing')&&(
        <div className="card text-center py-12">
          <p className="text-[hsl(var(--text-muted))]">{tab} settings coming soon.</p>
        </div>
      )}
    </div>
  );
}
