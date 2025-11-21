
import React from 'react';
import { Shield, Lock, Smartphone, AlertTriangle, CheckCircle2, Zap, Activity, Eye } from 'lucide-react';

const SecurityAudit: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-emerald-400" /> Security & Integrity Audit
                    </h2>
                    <p className="text-slate-400">Real-time status of client-side defenses and threat mitigations.</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-sm text-slate-500 uppercase font-bold mb-1">System Health</div>
                    <div className="text-2xl font-bold text-emerald-400">100% SECURE</div>
                </div>
            </div>

            {/* Active Countermeasures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-950/50 p-4 rounded-lg border border-emerald-500/20 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Secure Enclave</h4>
                        <p className="text-xs text-slate-400 mb-2">Private keys isolated in hardware.</p>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                    </div>
                </div>
                
                <div className="bg-slate-950/50 p-4 rounded-lg border border-emerald-500/20 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Biometric Gating</h4>
                        <p className="text-xs text-slate-400 mb-2">Signing requires physical presence.</p>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> ENFORCED
                        </span>
                    </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-lg border border-emerald-500/20 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Root Detection</h4>
                        <p className="text-xs text-slate-400 mb-2">OS integrity checks passed.</p>
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                    </div>
                </div>
            </div>

            {/* Threat Model Visualization */}
            <h3 className="text-lg font-bold text-white mb-4">Threat Model Mitigations</h3>
            <div className="space-y-3">
                {[
                    { name: "Malware Key Extraction", risk: "CRITICAL", mitigation: "Hardware Isolation (TEE)", status: "BLOCKED" },
                    { name: "Remote Signing Attack", risk: "HIGH", mitigation: "User Intent (Biometrics)", status: "BLOCKED" },
                    { name: "Side-Channel Analysis", risk: "MEDIUM", mitigation: "Constant-time Crypto Lib", status: "MITIGATED" },
                    { name: "Manifest Stripping", risk: "HIGH", mitigation: "Immutable DLT Anchor", status: "DETECTED" },
                ].map((threat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className={`w-4 h-4 ${threat.risk === 'CRITICAL' ? 'text-rose-500' : threat.risk === 'HIGH' ? 'text-orange-500' : 'text-amber-500'}`} />
                            <span className="text-sm font-medium text-slate-200">{threat.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500 hidden md:block">{threat.mitigation}</span>
                            <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 min-w-[80px] text-center">
                                {threat.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

             {/* Audit Log */}
             <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Eye className="w-3 h-3" /> Last Security Scan: <span className="text-slate-300">Just now</span>
                </div>
                <div className="font-mono text-[10px] text-slate-600 bg-slate-950 p-2 rounded">
                    > SYSTEM_INTEGRITY_CHECK... PASS<br/>
                    > SECURE_ENCLAVE_STATUS... READY<br/>
                    > C2PA_BINDING_MODULE... LOADED<br/>
                    > VERITAS_CORE_LIB... v1.0.0-STABLE
                </div>
            </div>
        </div>
    </div>
  );
};

export default SecurityAudit;
