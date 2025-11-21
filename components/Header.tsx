
import React from 'react';
import { ShieldCheck, Menu, Network, PenTool, Globe } from 'lucide-react';

interface Props {
  mode: 'VERIFIER' | 'CREATOR';
  setMode: (mode: 'VERIFIER' | 'CREATOR') => void;
  view: 'HOME' | 'ECOSYSTEM';
  setView: (view: 'HOME' | 'ECOSYSTEM') => void;
}

const Header: React.FC<Props> = ({ mode, setMode, view, setView }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-xl hidden sm:block">
            Veritas<span className="text-cyan-400">Chain</span>
          </span>
          <span className="ml-2 text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded px-1.5 py-0.5 align-top">v1.0.0 Mainnet</span>
        </div>
        
        <div className="flex items-center gap-4">
            {/* View Switcher: Home vs Ecosystem */}
            <div className="hidden md:flex gap-1 mr-4">
                <button 
                    onClick={() => setView('HOME')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'HOME' ? 'text-slate-100 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Tools
                </button>
                <button 
                    onClick={() => setView('ECOSYSTEM')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'ECOSYSTEM' ? 'text-slate-100 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Ecosystem
                </button>
            </div>

            {/* Mode Switcher (Only visible in Home View) */}
            {view === 'HOME' && (
                <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
                    <button 
                        onClick={() => setMode('VERIFIER')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'VERIFIER' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Verifier
                    </button>
                    <button 
                        onClick={() => setMode('CREATOR')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${mode === 'CREATOR' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <PenTool className="w-3 h-3" /> Creator
                    </button>
                </div>
            )}

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 border-l border-slate-800 pl-4">
            <button className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs">
                <Network className="w-3 h-3" />
                <span>Mainnet Active</span>
            </button>
            </nav>

            <button className="md:hidden text-slate-400">
            <Menu className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
