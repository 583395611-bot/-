import React, { useState } from 'react';
import { DesignInput, AppState } from '../types';
import { Layers, Users, Box, ArrowRight, Loader2 } from 'lucide-react';

interface InputPanelProps {
  onAnalyze: (data: DesignInput) => void;
  appState: AppState;
}

const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, appState }) => {
  const [formData, setFormData] = useState<DesignInput>({
    projectName: '',
    requirements: '',
    targetUsers: '',
    spatialContext: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appState === AppState.ANALYZING) return;
    onAnalyze(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-architect-800/50 backdrop-blur-sm border-r border-architect-800 h-full p-6 flex flex-col shadow-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="text-accent-cyan" />
          DesignStrat<span className="text-accent-cyan">.ai</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">参数化设计策略可视化引擎</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">项目名称</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="例如：新未来图书馆"
              className="w-full bg-architect-900 border border-architect-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-accent-cyan focus:border-transparent outline-none transition-all placeholder-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-2"><Layers size={14} /> 设计需求</span>
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="功能需求，美学目标，关键活动..."
              className="w-full bg-architect-900 border border-architect-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-accent-cyan focus:border-transparent outline-none transition-all placeholder-gray-600 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-2"><Users size={14} /> 目标人群</span>
            </label>
            <textarea
              name="targetUsers"
              value={formData.targetUsers}
              onChange={handleChange}
              placeholder="人口统计，行为模式，用户流线..."
              className="w-full bg-architect-900 border border-architect-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-accent-cyan focus:border-transparent outline-none transition-all placeholder-gray-600 h-24 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
               <span className="flex items-center gap-2"><Box size={14} /> 空间环境 / 背景</span>
            </label>
            <textarea
              name="spatialContext"
              value={formData.spatialContext}
              onChange={handleChange}
              placeholder="场地限制，面积大小，光照条件，现有结构..."
              className="w-full bg-architect-900 border border-architect-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-accent-cyan focus:border-transparent outline-none transition-all placeholder-gray-600 h-24 resize-none"
              required
            />
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            type="submit"
            disabled={appState === AppState.ANALYZING}
            className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              appState === AppState.ANALYZING
                ? 'bg-architect-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-accent-cyan to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 text-white'
            }`}
          >
            {appState === AppState.ANALYZING ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                正在分析...
              </>
            ) : (
              <>
                生成设计策略
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPanel;