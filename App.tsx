import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import StrategyDashboard from './components/StrategyDashboard';
import { DesignInput, StrategyAnalysis, AppState } from './types';
import { generateDesignStrategy } from './services/geminiService';
import { AlertTriangle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [strategyData, setStrategyData] = useState<StrategyAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (input: DesignInput) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    
    try {
      const result = await generateDesignStrategy(input);
      setStrategyData(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("生成策略失败。请检查您的API密钥并重试。");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-architect-950 font-sans text-white selection:bg-accent-cyan selection:text-white">
      
      {/* Left Sidebar - Input */}
      <div className="w-96 flex-shrink-0 z-20 relative">
        <InputPanel onAnalyze={handleAnalyze} appState={appState} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative h-full">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        {appState === AppState.IDLE && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 animate-fade-in">
            <div className="w-24 h-24 bg-architect-800/50 rounded-full flex items-center justify-center mb-6 border border-architect-700 shadow-2xl backdrop-blur-sm">
              <Sparkles className="text-accent-cyan w-10 h-10" />
            </div>
            <h2 className="text-3xl font-light text-white mb-2">准备开始构思</h2>
            <p className="text-gray-400 max-w-md">在左侧输入您的项目需求，生成全面的空间策略分析。</p>
          </div>
        )}

        {appState === AppState.ANALYZING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-architect-950/80 backdrop-blur-sm">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-accent-cyan font-mono text-sm uppercase tracking-widest">策略生成中...</p>
            <p className="text-gray-500 text-xs mt-2">连接功能区域 • 分析用户动线</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-8">
             <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/50">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">分析出错</h3>
            <p className="text-gray-400">{errorMsg}</p>
            <button 
              onClick={() => setAppState(AppState.IDLE)}
              className="mt-6 px-6 py-2 bg-architect-800 hover:bg-architect-700 rounded-lg text-sm transition-colors border border-architect-700"
            >
              重试
            </button>
          </div>
        )}

        {appState === AppState.SUCCESS && strategyData && (
          <StrategyDashboard data={strategyData} />
        )}
      </main>
    </div>
  );
};

export default App;