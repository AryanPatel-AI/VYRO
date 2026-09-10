'use client';
import { Plus, ExternalLink } from 'lucide-react';
const MOCK_BRANDS = [
  {id:'1',name:'TechGear Pro',industry:'Consumer Tech',website:'techgear.com',contactName:'Rahul Mehta',contactEmail:'rahul@techgear.com',_count:{sponsorships:2}},
  {id:'2',name:'CamShield',industry:'Tech Accessories',website:'camshield.com',contactName:'Priya Sharma',contactEmail:'priya@camshield.com',_count:{sponsorships:1}},
  {id:'3',name:'AudioSphere',industry:'Audio',website:'audiosph.com',contactName:'Amit Kumar',contactEmail:'amit@audiosph.com',_count:{sponsorships:1}},
];
export default function BrandsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Brand CRM</h1><p className="text-[hsl(var(--text-secondary))] text-sm mt-1">{MOCK_BRANDS.length} brands in your network</p></div>
        <button className="btn-primary text-sm"><Plus className="w-4 h-4"/>Add Brand</button>
      </div>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--bg-border))]">
              {['Brand','Industry','Contact','Website','Deals',''].map(h=><th key={h} className="text-left px-6 py-4 text-xs font-semibold text-[hsl(var(--text-muted))] uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {MOCK_BRANDS.map((b,i)=>(
              <tr key={b.id} className="border-b border-[hsl(var(--bg-border))] hover:bg-[hsl(var(--bg-elevated))] transition-colors">
                <td className="px-6 py-4 font-semibold">{b.name}</td>
                <td className="px-6 py-4 text-[hsl(var(--text-secondary))]">{b.industry}</td>
                <td className="px-6 py-4 text-[hsl(var(--text-secondary))]">{b.contactName}</td>
                <td className="px-6 py-4"><a href={`https://${b.website}`} target="_blank" className="flex items-center gap-1 text-[hsl(var(--vyro-purple))] hover:opacity-80">{b.website}<ExternalLink className="w-3 h-3"/></a></td>
                <td className="px-6 py-4"><span className="badge badge-scheduled">{b._count.sponsorships} deal{b._count.sponsorships!==1?'s':''}</span></td>
                <td className="px-6 py-4"><a href={`/sponsors?brand=${b.id}`} className="btn-ghost text-xs">View Deals →</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
