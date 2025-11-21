
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import VerificationResult from './components/VerificationResult';
import GovernanceDashboard from './components/GovernanceDashboard';
import SecureEnclaveSetup from './components/SecureEnclaveSetup';
import BiometricAuthModal from './components/BiometricAuthModal';
import { VerificationStatus, AnalysisResult, TransformationEvent, SecureKeyMetadata } from './types';
import { computeMerkleRoot, verifyContentOnChain, registerContentOnChain, registerDerivativeOnChain, getMockParentHash, getMediaType, calculateNetworkFee, getNetworkStats, getValidators, getProposals, getPartners, getTreasuryAllocation, getSecureKeyMetadata } from './services/ledgerService';
import { analyzeMediaForensics } from './services/geminiService';
import { Upload, Loader2, Camera, ShieldCheck, Film, Mic, Image as ImageIcon, FileDiff, History, Coins } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'ECOSYSTEM'>('HOME');
  const [mode, setMode] = useState<'VERIFIER' | 'CREATOR'>('VERIFIER');
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Creator Mode State
  const [creatorTab, setCreatorTab] = useState<'CAPTURE' | 'DERIVATIVE'>('CAPTURE');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredHash, setRegisteredHash] = useState('');
  const [estimatedFee, setEstimatedFee] = useState(0);
  
  // Security State (Phase 2)
  const [secureKey, setSecureKey] = useState<SecureKeyMetadata | null>(getSecureKeyMetadata());
  const [showBiometric, setShowBiometric] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCurrentFile(file);

    if (mode === 'CREATOR') {
        const hash = await computeMerkleRoot(file);
        setFileHash(hash);
        setEstimatedFee(calculateNetworkFee(file.size, creatorTab === 'DERIVATIVE'));
        setIsRegistering(false);
        setRegistrationSuccess(false);
        setRegisteredHash('');
        return;
    }

    await runVerification(file);
  };

  const runVerification = async (file: File) => {
    setStatus(VerificationStatus.ANALYZING);
    setAnalysisResult(null);
    
    try {
      setLoadingMessage('VCL: Calculating Merkle Root...');
      const hash = await computeMerkleRoot(file);
      setFileHash(hash);
      await new Promise(resolve => setTimeout(resolve, 400));

      setLoadingMessage('Ledger: Checking Provenance & Fingerprints...');
      const { record, vectorMatch, manifestIntegrity } = await verifyContentOnChain(file);
      await new Promise(resolve => setTimeout(resolve, 600));

      setLoadingMessage('AI Core: Running Media Forensics...');
      const aiResult = await analyzeMediaForensics(file);

      let finalStatus = VerificationStatus.UNVERIFIED;
      let score = 0;
      if (record) score += 40; 
      if (manifestIntegrity) score += 20; 
      if (vectorMatch.matchFound) score += 20;
      score += (aiResult.authenticityScore / 100) * 20;
      const veritasScore = Math.round(score);

      if (record && (vectorMatch.matchFound || record.parent_hash) && manifestIntegrity) {
          finalStatus = VerificationStatus.VERIFIED;
      } else if (!record && vectorMatch.matchFound) {
          finalStatus = VerificationStatus.TAMPERED; 
      } else if (record && (!vectorMatch.matchFound && !record.parent_hash)) {
          finalStatus = VerificationStatus.SUSPECT; 
      } else if (record && !manifestIntegrity) {
          finalStatus = VerificationStatus.TAMPERED;
      } else {
          finalStatus = VerificationStatus.UNVERIFIED;
      }

      setAnalysisResult({
        veritasScore,
        visualScore: aiResult.authenticityScore,
        blockchainMatch: !!record,
        vectorMatch: vectorMatch,
        record: record || vectorMatch.matchedRecord || null,
        aiReasoning: aiResult.conclusion,
        status: finalStatus,
        mediaType: getMediaType(file),
        manifestIntegrity
      });
      setStatus(finalStatus);

    } catch (error) {
      console.error(error);
      alert('Error processing verification');
      setStatus(null);
    }
  };

  // Triggered by UI Button
  const initiateRegistration = () => {
    if (!currentFile) return;
    setShowBiometric(true);
  };

  // Called after Biometric Success
  const performRegistration = async () => {
      setShowBiometric(false);
      setIsRegistering(true);

      try {
        if (creatorTab === 'CAPTURE') {
            setLoadingMessage(`Network Fee: ${estimatedFee} VRT processing...`);
            await new Promise(resolve => setTimeout(resolve, 600));

            setLoadingMessage('VCL: Generating C2PA Manifest & Anchor...');
            await new Promise(resolve => setTimeout(resolve, 600));
            
            setLoadingMessage('Secure Enclave: Signing Content Credentials...');
            await new Promise(resolve => setTimeout(resolve, 800)); // Slight delay for effect

            const record = await registerContentOnChain(currentFile, "Authenticated Creator", "Sony Alpha A7 IV (Certified)");
            setRegisteredHash(record.content_hash);
        } else {
            setLoadingMessage(`Network Fee: ${estimatedFee} VRT processing...`);
            await new Promise(resolve => setTimeout(resolve, 600));
            
            setLoadingMessage('Ledger: Linking Chain of Custody...');
            await new Promise(resolve => setTimeout(resolve, 600));

            const parentHash = getMockParentHash();
            const transformations: TransformationEvent[] = [
                {
                    timestamp: Date.now() - 100000,
                    action: 'CROP',
                    details: 'Crop to 16:9 Aspect Ratio',
                    tool_signature: 'Veritas Plugin v1.2'
                },
                {
                    timestamp: Date.now() - 50000,
                    action: 'FILTER',
                    details: 'Color Grading (LUT: Teal & Orange)',
                    tool_signature: 'Veritas Plugin v1.2'
                }
            ];

            const record = await registerDerivativeOnChain(currentFile, parentHash, "Verified Editor", transformations);
            setRegisteredHash(record.content_hash);
        }
        
        setRegistrationSuccess(true);
      } catch (e) {
        console.error(e);
        alert("Registration failed");
      } finally {
        setIsRegistering(false);
      }
  };

  const resetView = () => {
    setStatus(null);
    setAnalysisResult(null);
    setFileHash('');
    setCurrentFile(null);
    setRegistrationSuccess(false);
    setIsRegistering(false);
    setEstimatedFee(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-inter">
      <Header 
        mode={mode} 
        setMode={(m) => { resetView(); setMode(m); }} 
        view={view}
        setView={(v) => { resetView(); setView(v); }}
      />

      <BiometricAuthModal 
        isOpen={showBiometric}
        onSuccess={performRegistration}
        onCancel={() => setShowBiometric(false)}
      />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        
        {/* ECOSYSTEM DASHBOARD */}
        {view === 'ECOSYSTEM' ? (
            <GovernanceDashboard 
                stats={getNetworkStats()}
                validators={getValidators()}
                proposals={getProposals()}
                partners={getPartners()}
                treasury={getTreasuryAllocation()}
            />
        ) : (
            // MAIN TOOLS VIEW
            <div className="flex flex-col items-center justify-center w-full">
                
                {/* Hero / Intro */}
                {!status && !currentFile && !secureKey && mode === 'CREATOR' ? (
                   // If in Creator mode but no key, show Setup
                   <SecureEnclaveSetup onComplete={(k) => setSecureKey(k)} />
                ) : (
                   // Normal Flow
                  <>
                    {!status && !currentFile && (
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mb-6 ${
                            mode === 'CREATOR' 
                            ? 'bg-cyan-950/30 border-cyan-900/50 text-cyan-400' 
                            : 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400'
                        }`}>
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === 'CREATOR' ? 'bg-cyan-400' : 'bg-emerald-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${mode === 'CREATOR' ? 'bg-cyan-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        {mode === 'CREATOR' ? 'Authorized Workstation' : 'Public Verification Node'}
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                        {mode === 'CREATOR' ? 'Register Assets' : 'Verify Authenticity'}
                        </h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        {mode === 'CREATOR' 
                            ? 'Securely capture, sign, and register original media or edits. Requires VRT for network fees.'
                            : 'Instantly verify C2PA credentials and content provenance using decentralized ledger technology.'}
                        </p>
                    </div>
                    )}

                    {/* Creator Tabs */}
                    {mode === 'CREATOR' && !currentFile && (
                        <div className="flex gap-4 mb-8 bg-slate-900/50 p-1 rounded-lg border border-slate-800 animate-fade-in">
                            <button 
                                onClick={() => setCreatorTab('CAPTURE')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all ${creatorTab === 'CAPTURE' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                            >
                                <Camera className="w-4 h-4" /> Capture Original
                            </button>
                            <button 
                                onClick={() => setCreatorTab('DERIVATIVE')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all ${creatorTab === 'DERIVATIVE' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                            >
                                <FileDiff className="w-4 h-4" /> Register Edit
                            </button>
                        </div>
                    )}

                    {/* Upload Area */}
                    {!status && !registrationSuccess && (
                    <div className={`w-full max-w-xl animate-fade-in ${currentFile ? '' : 'hover:scale-[1.01] transition-transform duration-300'}`}>
                        <div className="relative group">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${mode === 'CREATOR' ? 'from-cyan-500 to-blue-600' : 'from-emerald-500 to-teal-600'}`}></div>
                        <div className="relative bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center shadow-2xl">
                            
                            {currentFile ? (
                            <div className="space-y-6">
                                <div className="w-16 h-16 rounded-xl bg-slate-800 mx-auto flex items-center justify-center border border-slate-700">
                                    {currentFile.type.startsWith('video/') ? <Film className="text-cyan-400 w-8 h-8"/> : 
                                        currentFile.type.startsWith('audio/') ? <Mic className="text-purple-400 w-8 h-8"/> :
                                        <ImageIcon className="text-emerald-400 w-8 h-8"/>}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{currentFile.name}</h3>
                                    <p className="text-slate-400 text-sm">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                
                                {mode === 'CREATOR' && (
                                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 text-left space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Action:</span>
                                            <span className={`font-mono font-bold ${creatorTab === 'CAPTURE' ? 'text-cyan-400' : 'text-purple-400'}`}>
                                                {creatorTab === 'CAPTURE' ? 'REGISTER ORIGINAL' : 'REGISTER DERIVATIVE'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Estimated Gas Fee:</span>
                                            <span className="font-mono text-amber-400 flex items-center gap-1">
                                                <Coins className="w-3 h-3" /> {estimatedFee} VRT
                                            </span>
                                        </div>
                                        {secureKey && (
                                           <div className="flex justify-between text-sm pt-2 border-t border-slate-800">
                                              <span className="text-slate-500">Signing Key:</span>
                                              <span className="font-mono text-emerald-400 text-xs flex items-center gap-1">
                                                  <ShieldCheck className="w-3 h-3" /> Secure Enclave
                                              </span>
                                           </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-3 justify-center pt-4">
                                    <button onClick={resetView} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                                    
                                    {mode === 'CREATOR' ? (
                                        <button 
                                            onClick={initiateRegistration}
                                            disabled={isRegistering}
                                            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all ${isRegistering ? 'bg-slate-700 cursor-wait' : creatorTab === 'CAPTURE' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500'}`}
                                        >
                                            {isRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                            {isRegistering ? 'Processing...' : 'Pay Fee & Register'}
                                        </button>
                                    ) : (
                                        <span className="hidden"></span>
                                    )}
                                </div>
                            </div>
                            ) : (
                            <>
                                <div className={`mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-6 ${mode === 'CREATOR' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                <Upload className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-200 mb-2">
                                    {mode === 'CREATOR' ? 'Drop assets to register' : 'Upload media to verify'}
                                </h3>
                                <p className="text-slate-400 text-sm mb-8">
                                Supports Images (JPG, PNG), Video (MP4, MOV), and Audio (WAV, MP3)
                                </p>
                                
                                <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                id="file-upload" 
                                onChange={handleFileSelect}
                                accept="image/*,video/*,audio/*"
                                />
                                <label 
                                htmlFor="file-upload"
                                className={`cursor-pointer inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${mode === 'CREATOR' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'}`}
                                >
                                Select File
                                </label>
                            </>
                            )}

                        </div>
                        </div>
                    </div>
                    )}

                    {/* Loading State */}
                    {status === VerificationStatus.ANALYZING && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="relative h-24 w-24 mb-8">
                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                        <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                        <ShieldCheck className="absolute inset-0 m-auto h-8 w-8 text-cyan-500 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-100 mb-2">Verifying Provenance</h3>
                        <p className="text-cyan-400 font-mono text-sm animate-pulse">{loadingMessage}</p>
                    </div>
                    )}

                    {/* Result View */}
                    {status && status !== VerificationStatus.ANALYZING && analysisResult && (
                    <VerificationResult 
                        result={analysisResult} 
                        fileHash={fileHash}
                        onReset={resetView} 
                    />
                    )}

                    {/* Registration Success View */}
                    {registrationSuccess && (
                        <div className="w-full max-w-2xl animate-fade-in">
                            <div className="bg-slate-900 rounded-2xl border border-emerald-500/30 p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Asset Securely Registered</h2>
                                <p className="text-slate-400 mb-8">
                                    Content Credentials (C2PA) have been generated and the transaction has been finalized on the Veritas Chain.
                                </p>

                                <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 text-left mb-8 space-y-4">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Merkle Root Hash</span>
                                        <div className="font-mono text-emerald-400 break-all">{registeredHash}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Transaction ID</span>
                                            <div className="font-mono text-slate-300 text-sm">0x8f...3a21</div>
                                        </div>
                                        <div>
                                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Fee Paid</span>
                                            <div className="font-mono text-amber-400 text-sm">{estimatedFee} VRT</div>
                                        </div>
                                    </div>
                                    {secureKey && (
                                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Hardware Signature</span>
                                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400 font-mono border border-slate-800">
                                                {secureKey.keyId.substring(0, 8)}...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={resetView}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-medium transition-all"
                                >
                                    Register Another Asset
                                </button>
                            </div>
                        </div>
                    )}
                  </>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
