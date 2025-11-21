
import React, { useState } from 'react';
import { Activity, Globe, Server, Users, Vote, Terminal, Key, Shield, CircleDollarSign, CheckCircle, Lock, LayoutGrid, Book } from 'lucide-react';
import { NetworkStats, ValidatorNode, GovernanceProposal, Partner, TreasuryAllocation } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import ApiDocumentation from './ApiDocumentation';
import SecurityAudit from './SecurityAudit';

interface Props {
    stats: NetworkStats;
    validators: ValidatorNode[];
    proposals: GovernanceProposal[];
    partners: Partner[];
    treasury: TreasuryAllocation[];
}

const GovernanceDashboard: React.FC<Props> = ({ stats, validators, proposals, partners, treasury }) => {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'API' | 'SECURITY'>('DASHBOARD');

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            
            {/* Dashboard Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                        DAO Governance Active
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">Global Ecosystem</h2>
                    <p className="text-slate-400 max-w-xl">
                        Transparency portal for the Veritas decentralized network. Monitor health, vote on proposals, and access developer resources.
                    </p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('DASHBOARD')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'DASHBOARD' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Activity className="w-4 h-4" /> Network
                    </button>
                    <button 
                        onClick={() => setActiveTab('SECURITY')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'SECURITY' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Shield className="w-4 h-4" /> Security
                    </button>
                    <button 
                        onClick={() => setActiveTab('API')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'API' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Book className="w-4 h-4" /> API
                    </button>
                </div>
            </div>

            {activeTab === 'API' ? (
                <ApiDocumentation />
            ) : activeTab === 'SECURITY' ? (
                <SecurityAudit />
            ) : (
                <div className="space-y-10">
                    {/* Network Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Globe className="w-16 h-16" /></div>
                            <div className="flex items-center gap-3 mb-2 text-cyan-400">
                                <Activity className="w-5 h-5" />
                                <span className="font-semibold text-sm uppercase">Global TPS</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.tps.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 mt-1">Transactions per second</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Server className="w-16 h-16" /></div>
                            <div className="flex items-center gap-3 mb-2 text-emerald-400">
                                <Server className="w-5 h-5" />
                                <span className="font-semibold text-sm uppercase">Block Height</span>
                            </div>
                            <div className="text-3xl font-bold text-white">#{stats.blockHeight.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 mt-1">Finalized blocks</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16" /></div>
                            <div className="flex items-center gap-3 mb-2 text-purple-400">
                                <Users className="w-5 h-5" />
                                <span className="font-semibold text-sm uppercase">Active Nodes</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.activeNodes}</div>
                            <div className="text-xs text-slate-500 mt-1">Validating integrity</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CircleDollarSign className="w-16 h-16" /></div>
                            <div className="flex items-center gap-3 mb-2 text-amber-400">
                                <Shield className="w-5 h-5" />
                                <span className="font-semibold text-sm uppercase">Treasury (VRT)</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.treasuryBalanceVRT.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 mt-1">DAO Controlled Funds</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: DAO Governance (8 cols) */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Active Proposals */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Vote className="w-5 h-5 text-purple-400" /> Hybrid Governance
                                    </h3>
                                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-300 transition-colors">
                                        View All Proposals
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {proposals.map((prop) => (
                                        <div key={prop.id} className="p-5 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors relative overflow-hidden group">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                                prop.type === 'PARTNER_ONBOARDING' ? 'bg-emerald-500' : 
                                                prop.type === 'FEE_UPDATE' ? 'bg-cyan-500' : 'bg-purple-500'
                                            }`}></div>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded">{prop.type.replace('_', ' ')}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${prop.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' : prop.status === 'TIMELOCK_PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                            {prop.status.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                                            {prop.votingMechanism === 'QUADRATIC' ? 'Quadratic Voting' : 
                                                             prop.votingMechanism === 'MULTI_SIG' ? 'Multi-Sig (3/5)' : 'Snapshot'}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-semibold text-slate-100 mb-1">{prop.title}</h4>
                                                    <p className="text-xs text-slate-400 mb-3 line-clamp-1">{prop.description}</p>
                                                    
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <span>Proposer: {prop.proposer}</span>
                                                        <span>Ends: {new Date(prop.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="min-w-[200px]">
                                                    {prop.votingMechanism === 'MULTI_SIG' ? (
                                                        <div>
                                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                                <span>Signatures: {prop.signaturesCollected}/{prop.signaturesRequired}</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3 flex gap-0.5">
                                                                {[...Array(prop.signaturesRequired)].map((_, i) => (
                                                                    <div key={i} className={`flex-1 rounded-full ${i < (prop.signaturesCollected || 0) ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                                {prop.votingMechanism === 'QUADRATIC' ? (
                                                                    <>
                                                                        <span>QV: {prop.quadraticVotesFor}</span>
                                                                        <span className="text-slate-600">(Raw: {(prop.votesFor / 1000).toFixed(0)}k)</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>For: {(prop.votesFor / 1000).toFixed(1)}k</span>
                                                                        <span>Against: {(prop.votesAgainst / 1000).toFixed(1)}k</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                                                                <div 
                                                                    className={`h-full ${prop.status === 'PASSED' ? 'bg-emerald-500' : prop.status === 'TIMELOCK_PENDING' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                                    style={{ width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {prop.status === 'ACTIVE' && (
                                                        <button className="w-full py-1.5 rounded bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 text-xs font-bold transition-colors">
                                                            {prop.votingMechanism === 'MULTI_SIG' ? 'Sign as Delegate' : 'Connect Wallet to Vote'}
                                                        </button>
                                                    )}
                                                    {prop.status === 'TIMELOCK_PENDING' && (
                                                        <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-bold">
                                                            <Lock className="w-3 h-3" /> 48h Security Delay
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Strategic Ecosystem */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <LayoutGrid className="w-5 h-5 text-emerald-400" /> Trusted Partner Network
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {partners.map((partner) => (
                                        <div key={partner.id} className="flex items-start gap-4 p-4 bg-slate-950 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-colors">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                                                partner.type === 'HARDWARE' ? 'bg-amber-500/20 text-amber-400' :
                                                partner.type === 'MEDIA' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-purple-500/20 text-purple-400'
                                            }`}>
                                                {partner.logoInitial}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-bold text-slate-200">{partner.name}</h4>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                        partner.status === 'INTEGRATED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                        partner.status === 'BETA' ? 'bg-cyan-500/20 text-cyan-400' :
                                                        'bg-slate-700 text-slate-400'
                                                    }`}>
                                                        {partner.status}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold mt-1 mb-1">{partner.type}</div>
                                                <p className="text-xs text-slate-400 leading-snug">{partner.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Treasury & Tools (4 cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            
                            {/* Treasury Allocation */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col h-[380px]">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <CircleDollarSign className="w-5 h-5 text-amber-400" /> Foundation Treasury
                                </h3>
                                <p className="text-xs text-slate-500 mb-4">Funds are allocated via DAO proposals.</p>
                                
                                <div className="flex-1 relative">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={treasury}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="amount"
                                            >
                                                {treasury.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                                                itemStyle={{ color: '#f8fafc' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Legend */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="block text-2xl font-bold text-white">100%</span>
                                            <span className="text-[10px] text-slate-500 uppercase">Allocated</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {treasury.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                                                <span className="text-slate-300">{t.category}</span>
                                            </div>
                                            <span className="font-bold text-slate-400">{t.amount}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Developer Tools */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-slate-400" /> Developer Access
                                </h3>
                                
                                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-500 uppercase font-bold">API Key (Live)</span>
                                        <span className="text-xs text-emerald-400">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-slate-900 p-2 rounded text-xs font-mono text-slate-300 border border-slate-800">
                                            sk_live_vrt_992...k81
                                        </code>
                                        <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">
                                            <Key className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setActiveTab('API')}
                                    className="w-full py-2 mb-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Book className="w-4 h-4" /> View API Docs
                                </button>

                                <div className="pt-6 border-t border-slate-800">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Browser Extension</h4>
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-3 rounded-lg flex items-center gap-3 border border-slate-700/50 cursor-pointer hover:border-cyan-500/50 transition-colors group">
                                        <div className="bg-cyan-500/20 p-2 rounded-md text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">Download for Chrome</div>
                                            <div className="text-[10px] text-slate-500">v1.0.0 • Auto-verification overlay</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernanceDashboard;
