'use client';
import { Plus, TrendingUp } from 'lucide-react';
import { scoreColor } from '@/lib/utils';

const SCORE_DIMS = ['nicheCompatibility','audienceCompatibility','geoCompatibility','platformCompatibility','engagementCompatibility'];
const DIM_LABELS: Record<string,string> = {nicheCompatibility:'Niche',audienceCompatibility:'Audience',geoCompatibility:'Geography',platformCompatibility:'Platform',engagementCompatibility:'Engagement'};
const MOCK_BRANDS = [
  {id:'1',name:'XYZ Mobile',industry:'Smartphones',website:'xyzmobile.in',overall:94,breakdown:{nicheCompatibility:96,audienceCompatibility:94,geoCompatibility:98,platformCompatibility:92,engagementCompatibility:90,historicalPerformance:88},reasoning:'Perfect niche alignment with tech/smartphone content.'},
  {id:'2',name:'ABC Accessories',industry:'Phone Accessories',website:'abc-acc.in',overall:91,breakdown:{nicheCompatibility:92,audienceCompatibility:90,geoCompatibility:95,platformCompatibility:88,engagementCompatibility:86,historicalPerformance:84},reasoning:'Strong audience overlap with accessory buyers.'},
  {id:'3',name:'TechGear',industry:'Consumer Tech',website:'techgear.com',overall:87,breakdown:{nicheCompatibility:88,audienceCompatibility:86,geoCompatibility:90,platformCompatibility:85,engagementCompatibility:82,historicalPerformance:80},reasoning:'Good fit across all compatibility dimensions.'},
  {id:'4',name:'CameraCo',industry:'Photography',website:'cameraco.in',overall:82,breakdown:{nicheCompatibility:85,audienceCompatibility:82,geoCompatibility:88,platformCompatibility:80,engagementCompatibility:78,historicalPerformance:76},reasoning:'Photography audience intersects well with creator niche.'},
];
export default function DiscoveryPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brand Discovery</h1>
          <p className="text-[hsl(var(--text-secondary))] text-sm mt-1">AI-matched sponsorship opportunities based on your profile — Tech + Smartphones · India · 400K+ total reach</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {MOCK_BRANDS.map((brand,i)=>(
          <div key={brand.id} className="card gradient-border space-y-4" style={{animationDelay:`${i*80}ms`}}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--bg-border))] to-[hsl(var(--bg-elevated))] flex items-center justify-center font-bold text-lg">{brand.name[0]}</div>
                <div>
                  <p className="font-semibold">{brand.name}</p>
                  <p className="text-xs text-[hsl(var(--text-muted))]">{brand.industry}</p>
                  <a href={`https://${brand.website}`} className="text-xs text-[hsl(var(--vyro-purple))] hover:opacity-80">{brand.website}</a>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black" style={{color:scoreColor(brand.overall)}}>{brand.overall}%</p>
                <p className="text-[10px] text-[hsl(var(--text-muted))]">match score</p>
              </div>
            </div>
            <div className="space-y-2">
              {SCORE_DIMS.map(dim=>(
                <div key={dim}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[hsl(var(--text-muted))]">{DIM_LABELS[dim]}</span>
                    <span className="font-semibold" style={{color:scoreColor((brand.breakdown as any)[dim])}}>{(brand.breakdown as any)[dim]}</span>
                  </div>
                  <div className="score-bar"><div className="score-bar-fill" style={{width:`${(brand.breakdown as any)[dim]}%`}}/></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[hsl(var(--text-secondary))] italic">"{brand.reasoning}"</p>
            <button className="btn-primary w-full text-sm"><Plus className="w-4 h-4"/>Add to CRM</button>
          </div>
        ))}
      </div>
    </div>
  );
}
