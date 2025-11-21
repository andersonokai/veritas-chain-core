
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileSearch, 
  Activity,
  Hash,
  Scan,
  AlertTriangle,
  Video,
  Mic,
  Image as ImageIcon,
  GitCommit,
  FileJson,
  Coins,
  X,
  Zap,
  Link,
  ShieldCheck
} from 'lucide-react';
import { VerificationStatus, AnalysisResult } from '../types';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface Props {
  result: AnalysisResult;
  fileHash: string;
  onReset: () => void;
}

const VerificationResult: React.FC<Props> = ({ result, fileHash, onReset }) => {
  const [showC2PA, setShowC2PA] = useState(false);
  
  const getStatusColor = () => {
    switch (result.status) {
      case VerificationStatus.VERIFIED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case VerificationStatus.TAMPERED: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case VerificationStatus.UNVERIFIED: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case VerificationStatus.VERIFIED: return <CheckCircle2 className="h-12 w-12" />;
      case VerificationStatus.TAMPERED: return <AlertTriangle className="h-12 w-12" />;
      case VerificationStatus.UNVERIFIED: return <XCircle className="h-12 w-12" />;
      default: return <FileSearch className="h-12 w-12" />;
    }
  };

  // Chart Data
  const data = [
    { name: 'Trust', value: result.veritasScore },
    { name: 'Risk', value: 100 - result.veritasScore },
  ];
  const CHART_COLORS = [result.veritasScore > 80 ? '#10b981' : result.veritasScore > 50 ? '#f59e0b' : '#f43f5e', '#1e293b'];

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in relative">
      
      {/* C2PA Modal */}
      {showC2PA && result.record?.c2pa_manifest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
                      <h3 className="font-bold text-white flex items-center gap-2">
                          <FileJson className="w-4 h-4 text-purple-400" /> C2PA Content Credentials
                      </h3>
                      <button onClick={() => setShowC2PA(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="p-0 overflow-y-auto max-h-[60vh]">
                      <div className="p-6 space-y-6">
                          <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                  <div className="text-xs text-slate-500 uppercase font-bold">Signer</div>
                                  <div className="text-sm text-white font-mono">{result.record.c2pa_manifest.signature_info.issuer}</div>
                              </div>
                              <div className="space-y-1 text-right">
                                  <div className="text-xs text-slate-500 uppercase font-bold">Claim Generator</div>
                                  <div className="text-sm text-emerald-400">{result.record.c2pa_manifest.claim_generator}</div>
                              </div>
                          </div>
                          
                          {result.record.manifest_digest && (
                              <div className="bg-purple-500/10 p-3 rounded border border-purple-500/30 flex flex-col gap-1">
                                  <span className="text-xs text-purple-300 font-bold uppercase flex items-center gap-1">
                                      <Link className="w-3 h-3" /> Immutable Anchor (Manifest Digest)
                                  </span>
                                  <span className="text-xs font-mono text-slate-300 break-all">{result.record.manifest_digest}</span>
                              </div>
                          )}

                          <div className="space-y-2">
                              <div className="text-xs text-slate-500 uppercase font-bold">Standard Assertions</div>
                              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto">
                                  {JSON.stringify(result.record.c2pa_manifest.assertions, null, 2)}
                              </div>
                          </div>

                          <div className="bg-slate-950/50 p-3 rounded border border-slate-800 flex items-center justify-between">
                              <span className="text-xs text-slate-400">Instance ID</span>
                              <span className="text-xs font-mono text-slate-500">{result.record.c2pa_manifest.instance_id}</span>
                          </div>
                      </div>
                  </div>
                  <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                      <button onClick={() => setShowC2PA(false)} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 text-sm">Close</button>
                  </div>
              </div>
          </div>
      )}

      {/* Top Score Banner */}
      <div className={`relative overflow-hidden rounded-2xl border p-8 mb-8 ${getStatusColor()}`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 relative">
             {getStatusIcon()}
             {result.status === VerificationStatus.VERIFIED && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    100%
                </div>
             )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    {result.record?.parent_hash ? 'Authentic Derivative Work' : 
                    result.status === VerificationStatus.VERIFIED ? 'Certified Authentic Original' : 
                    result.status === VerificationStatus.TAMPERED ? 'Potential Modification Detected' : 
                    'Unverified Source'}
                </h2>
                {/* Incentive Badge */}
                {result.veritasScore > 90 && (
                    <div className="hidden md:flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-md shadow-lg border border-blue-400/50 animate-pulse">
                        <Zap className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Social Boost Active</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-current/60 mb-2">
                {result.mediaType === 'VIDEO' && <Video className="w-4 h-4" />}
                {result.mediaType === 'AUDIO' && <Mic className="w-4 h-4" />}
                {result.mediaType === 'IMAGE' && <ImageIcon className="w-4 h-4" />}
                <span className="text-sm font-medium">{result.mediaType} Asset</span>
            </div>
            <p className="text-current/80 max-w-2xl leading-relaxed">
                {result.status === VerificationStatus.VERIFIED ? 'Valid Merkle Root, C2PA Manifest, and Source Fingerprint match. Content is original and unaltered.' : 
                 'Verification status indicates potential issues with content integrity or origin.'}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-950/30 rounded-xl p-4 min-w-[140px] backdrop-blur-sm border border-white/10">
              <span className="text-sm font-medium opacity-70 uppercase tracking-wider mb-1">Veritas Score</span>
              <span className="text-4xl font-bold">{result.veritasScore}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-current opacity-5 blur-[80px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Column: The 3-Layer Check */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Layer 1: Blockchain & Audit Trail */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-slate-200 font-medium flex items-center gap-2">
                        <Hash className="w-4 h-4 text-cyan-400" /> Layer 1: Ledger & Metadata
                    </h3>
                    {result.record?.c2pa_manifest && (
                        <button 
                            onClick={() => setShowC2PA(true)}
                            className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                        >
                            <FileJson className="w-3 h-3" /> VIEW C2PA
                        </button>
                    )}
                </div>
                <div className="p-6">
                    {result.record ? (
                        <div className="space-y-6">
                            
                            {/* Dual Integrity Status Block */}
                            <div className="flex gap-4">
                                <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <div className="text-xs text-emerald-400 font-bold uppercase">Content Integrity</div>
                                        <div className="text-xs text-slate-400">Merkle Root Matches</div>
                                    </div>
                                </div>
                                <div className={`flex-1 rounded-lg p-3 flex items-center gap-3 border ${result.manifestIntegrity ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                    <Link className={`w-5 h-5 ${result.manifestIntegrity ? 'text-emerald-500' : 'text-amber-500'}`} />
                                    <div>
                                        <div className={`text-xs font-bold uppercase ${result.manifestIntegrity ? 'text-emerald-400' : 'text-amber-400'}`}>Manifest Anchor</div>
                                        <div className="text-xs text-slate-400">{result.manifestIntegrity ? 'Digest Matches Ledger' : 'Digest Mismatch'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Blockchain Record</span>
                                    <div className="text-sm text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                                        <div className="flex justify-between"><span>TxID:</span> <span className="text-cyan-400 font-mono text-xs">{result.record.provenance_link.substring(0,16)}...</span></div>
                                        <div className="flex justify-between"><span>Timestamp:</span> <span className="text-xs">{new Date(result.record.timestamp).toLocaleString()}</span></div>
                                        {result.record.network_fee_paid && (
                                            <div className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                                                <span className="flex items-center gap-1 text-xs text-slate-500"><Coins className="w-3 h-3"/> Fee Paid:</span> 
                                                <span className="text-xs text-amber-400">{result.record.network_fee_paid}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Merkle Root (SHA-256)</span>
                                    <div className="font-mono text-xs text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 break-all h-full flex items-center">
                                        {result.record.content_hash}
                                    </div>
                                </div>
                            </div>

                            {/* Chain of Custody Visualization */}
                            {result.record.parent_hash && (
                                <div className="border-t border-slate-800 pt-4">
                                    <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                                        <GitCommit className="w-4 h-4" /> Audit Trail
                                    </h4>
                                    <div className="relative pl-4 border-l-2 border-slate-800 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-600 border-2 border-slate-900"></div>
                                            <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50">
                                                <div className="text-xs text-emerald-500 font-bold mb-1">ORIGINAL SOURCE</div>
                                                <div className="text-xs text-slate-400">Authenticated Capture • Sony A7 IV</div>
                                            </div>
                                        </div>
                                        {result.record.transformations?.map((t, idx) => (
                                             <div key={idx} className="relative">
                                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-cyan-500 border-2 border-slate-900"></div>
                                                <div className="bg-cyan-950/20 p-3 rounded border border-cyan-900/30">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-xs text-cyan-400 font-bold">{t.action}</span>
                                                        <span className="text-[10px] text-slate-500">{new Date(t.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-300">{t.details}</div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                                            <div className="text-xs font-bold text-white">CURRENT ASSET</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">No immutable record found for this exact file Merkle root.</p>
                    )}
                </div>
            </div>

            {/* Layer 2: AI Fingerprint */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-slate-200 font-medium flex items-center gap-2">
                        <Scan className="w-4 h-4 text-purple-400" /> 
                        {result.mediaType === 'VIDEO' ? 'Layer 2: Temporal & Audio Fingerprint' : 
                         result.mediaType === 'AUDIO' ? 'Layer 2: Acoustic Signature (MAS)' : 
                         'Layer 2: PRNU Source Fingerprint'}
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${result.vectorMatch.similarityScore > 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                style={{ width: `${result.vectorMatch.similarityScore * 100}%`}}
                            />
                        </div>
                        <span className="text-sm font-mono text-slate-400">{(result.vectorMatch.similarityScore * 100).toFixed(1)}% Match</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        {result.vectorMatch.matchFound 
                            ? `Source Device Identified: ${result.vectorMatch.matchedRecord?.metadata?.device_model || 'Unknown Device'}.`
                            : `The intrinsic fingerprints do not match any registered source.`}
                    </p>
                </div>
            </div>

        </div>

        {/* Right Column: Visual Forensics */}
        <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-full">
                 <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-800">
                    <h3 className="text-slate-200 font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" /> Layer 3: AI Forensics
                    </h3>
                </div>
                <div className="p-6 flex flex-col items-center flex-1">
                    <div className="h-32 w-full relative flex items-center justify-center mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={50}
                                    startAngle={180}
                                    endAngle={0}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                            <span className="text-2xl font-bold text-slate-100">{result.visualScore}</span>
                            <span className="text-[10px] text-slate-500 uppercase">Score</span>
                        </div>
                    </div>
                    <div className="text-xs text-slate-300 text-center leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800 w-full mb-4">
                        {result.aiReasoning}
                    </div>
                </div>
            </div>
        </div>

      </div>

      <div className="flex justify-center">
          <button 
            onClick={onReset}
            className="bg-slate-100 text-slate-900 hover:bg-white transition-colors text-sm font-semibold flex items-center gap-2 px-6 py-3 rounded-full shadow-lg shadow-slate-900/50"
          >
            <FileSearch className="w-4 h-4" /> Verify Another Asset
          </button>
      </div>
    </div>
  );
};

export default VerificationResult;
