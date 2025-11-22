import React from 'react';
import { StrategyAnalysis } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import ForceGraph from './ForceGraph';
import ReactMarkdown from 'react-markdown';
import { Hexagon, Compass, Palette } from 'lucide-react';

interface StrategyDashboardProps {
  data: StrategyAnalysis;
}

const StrategyDashboard: React.FC<StrategyDashboardProps> = ({ data }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-architect-950 text-gray-200">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-xs font-mono uppercase border border-accent-cyan/20">
            策略已生成
          </span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">{data.coreConcept}</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-blue-600 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detailed Text & Principles */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Design Principles Card */}
          <div className="bg-architect-900 rounded-xl p-6 border border-architect-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Compass className="text-accent-rose" size={20} />
              核心设计原则
            </h3>
            <ul className="space-y-3">
              {data.designPrinciples.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-architect-800 border border-architect-700 flex items-center justify-center text-xs font-mono text-accent-cyan group-hover:bg-accent-cyan group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-300 leading-relaxed">{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-architect-900 rounded-xl p-6 border border-architect-800 shadow-lg">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Hexagon className="text-indigo-400" size={20} />
              策略深度分析
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-400">
              <ReactMarkdown>{data.detailedAnalysis}</ReactMarkdown>
            </div>
          </div>

           {/* Color Palette */}
           <div className="bg-architect-900 rounded-xl p-6 border border-architect-800 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="text-emerald-400" size={20} />
              氛围色板
            </h3>
            <div className="flex gap-4">
              {data.colorPaletteSuggestion.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-full shadow-md border-2 border-white/10 transition-transform hover:scale-110" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">{color}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Visualizations */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Spatial Graph (D3) */}
          <div className="w-full h-[450px] bg-architect-900 rounded-xl border border-architect-800 shadow-lg relative">
             {/* Graph is interactive, so we don't want overflow hidden on the container necessarily, but component handles it */}
             <ForceGraph data={data.spatialGraphData} width={800} height={450} />
          </div>

          {/* Radar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-architect-900 rounded-xl p-6 border border-architect-800 shadow-lg h-[350px]">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">性能指标雷达</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarChartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="策略评分"
                    dataKey="A"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="#06b6d4"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Actionable Insights / Stats placeholder */}
            <div className="bg-architect-900 rounded-xl p-6 border border-architect-800 shadow-lg flex flex-col justify-center">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">指标细分</h3>
              <div className="space-y-4">
                {data.radarChartData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{item.subject}</span>
                      <span className="font-mono text-accent-cyan">{item.A}%</span>
                    </div>
                    <div className="w-full bg-architect-950 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-accent-cyan to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${item.A}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDashboard;