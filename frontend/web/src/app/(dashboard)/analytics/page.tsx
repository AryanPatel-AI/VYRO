'use client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatNumber, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils';
import { useState } from 'react';

const PLATFORMS = ['INSTAGRAM','YOUTUBE','TIKTOK'];
const MOCK_DATA = Array.from({length:30},(_,i)=>({
  day:`Sep ${i+1}`,
  followers: 84000 + i * 120 + Math.floor(Math.random()*200),
  reach: Math.floor(15000 + Math.random()*25000),
  engagement: +(4 + Math.random()*8).toFixed(2),
}));

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState('INSTAGRAM');
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-[hsl(var(--text-secondary))] text-sm mt-1">Platform performance overview</p></div>
        <div className="flex gap-2">
          {PLATFORMS.map(p=>(
            <button key={p} onClick={()=>setPlatform(p)}
              className={`platform-pill cursor-pointer transition-all ${platform===p?'border-[hsl(var(--vyro-purple)/0.6)] bg-[hsl(var(--vyro-purple)/0.1)]':''}`}
              style={{color:platform===p?PLATFORM_COLORS[p]:undefined}}>
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Total Followers',value:'84.2K',delta:'+1.2K this week'},{label:'Avg. Reach',value:'22.8K',delta:'+3.1K this week'},{label:'Engagement Rate',value:'7.2%',delta:'+0.4% this week'}].map(s=>(
          <div key={s.label} className="stat-card">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-[hsl(var(--text-muted))] mt-1">{s.label}</p>
            <p className="text-xs text-green-400 mt-1">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Followers Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_DATA.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bg-border))" vertical={false}/>
              <XAxis dataKey="day" tick={{fill:'hsl(var(--text-muted))',fontSize:11}} axisLine={false} tickLine={false} interval={3}/>
              <YAxis tick={{fill:'hsl(var(--text-muted))',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>formatNumber(v)}/>
              <Tooltip contentStyle={{background:'hsl(var(--bg-elevated))',border:'1px solid hsl(var(--bg-border))',borderRadius:12,fontSize:12}} formatter={(v:number)=>[formatNumber(v),'']}/>
              <Line type="monotone" dataKey="followers" stroke={PLATFORM_COLORS[platform]} strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">Reach Per Day</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_DATA.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bg-border))" vertical={false}/>
              <XAxis dataKey="day" tick={{fill:'hsl(var(--text-muted))',fontSize:11}} axisLine={false} tickLine={false} interval={3}/>
              <YAxis tick={{fill:'hsl(var(--text-muted))',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>formatNumber(v)}/>
              <Tooltip contentStyle={{background:'hsl(var(--bg-elevated))',border:'1px solid hsl(var(--bg-border))',borderRadius:12,fontSize:12}} formatter={(v:number)=>[formatNumber(v),'']}/>
              <Bar dataKey="reach" fill={PLATFORM_COLORS[platform]+'88'} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
