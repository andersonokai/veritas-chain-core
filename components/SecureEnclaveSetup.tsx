
import React, { useState } from 'react';
import { Shield, Lock, Smartphone, Cpu, CheckCircle2, Loader2, Key, RefreshCw, ArrowRight } from 'lucide-react';
import { generateSecureEnclaveKey } from '../services/ledgerService';
import { SecureKeyMetadata } from '../types';

interface Props {
  onComplete: (metadata: SecureKeyMetadata) => void;
}

const SecureEnclaveSetup: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'INTRO' | 'GENERATING' | 'PASSPHRASE' | 'COMPLETE'>('INTRO');
  const [passphrase, setPassphrase] = useState('');
  const [keyData, setKeyData] = useState<SecureKeyMetadata | null>(null);

  const handleGenerate = async () => {
    setStep('GENERATING');
    const data = await generateSecureEnclaveKey("Authenticated Creator");
    setKeyData(data);
    setStep('PASSPHRASE');
  };

  const handleFinalize = () => {
    if (passphrase.length < 8) {
      alert("Passphrase must be at least 8 characters.");
      return;
    }
    if (keyData) {
      setStep('COMPLETE');
      setTimeout(() => {
        onComplete(keyData);
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>

        {step === 'INTRO' && (
          <div className="relative z-10 text-center space-y-6">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center border border-slate-700 mb-4">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Hardware Security Setup</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              To verify authenticity at the source, Veritas Chain generates a unique signing key inside your device's 
              <span className="text-cyan-400 font-semibold"> Secure Enclave</span>. This key is non-exportable and permanently bound to this hardware.
            </p>
            
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-left space-y-3">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400" /> Private Key never leaves device
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Hardware-backed signing
               </div>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              Initialize Secure Enclave <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'GENERATING' && (
          <div className="relative z-10 text-center space-y-8 py-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute w-24 h-24 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
              </div>
              <div className="h-24 flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Generating Keypair...</h3>
              <p className="text-xs text-slate-500 font-mono">Accessing Hardware Security Module (HSM)</p>
            </div>
          </div>
        )}

        {step === 'PASSPHRASE' && (
          <div className="relative z-10 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Create Recovery Phrase</h2>
              <p className="text-slate-400 text-sm mt-2">
                Since your key cannot be exported, you need a passphrase to encrypt a backup blob in case of device loss.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Passphrase</label>
              <input 
                type="password" 
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Enter a strong passphrase..."
              />
            </div>

            <button 
              onClick={handleFinalize}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all"
            >
              Finalize Setup
            </button>
          </div>
        )}

        {step === 'COMPLETE' && (
          <div className="relative z-10 text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/50 animate-bounce-subtle">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Device Bound</h2>
            <p className="text-slate-400 text-sm">
              Your Workstation is now authorized to sign content using the Secure Enclave.
            </p>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-xs text-slate-500">
              Key ID: {keyData?.keyId}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SecureEnclaveSetup;
