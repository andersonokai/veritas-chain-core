
import React, { useEffect, useState } from 'react';
import { ScanFace, Fingerprint, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { simulateBiometricSign } from '../services/ledgerService';

interface Props {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const BiometricAuthModal: React.FC<Props> = ({ isOpen, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'SCANNING' | 'SUCCESS' | 'ERROR'>('SCANNING');

  useEffect(() => {
    if (isOpen) {
      setStatus('SCANNING');
      const performAuth = async () => {
        try {
          const result = await simulateBiometricSign();
          if (result) {
            setStatus('SUCCESS');
            setTimeout(() => {
              onSuccess();
            }, 800);
          } else {
            setStatus('ERROR');
          }
        } catch (e) {
          setStatus('ERROR');
        }
      };
      performAuth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-72 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        {/* iOS Style Notch Indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-b-lg"></div>

        <div className="mt-4 mb-6 relative">
          {status === 'SCANNING' && (
            <div className="relative">
               <ScanFace className="w-16 h-16 text-slate-500 animate-pulse" />
               <div className="absolute inset-0 border-t-2 border-cyan-500 animate-scan-down opacity-50"></div>
            </div>
          )}
          {status === 'SUCCESS' && (
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-scale-in" />
          )}
          {status === 'ERROR' && (
            <XCircle className="w-16 h-16 text-rose-500" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">
            {status === 'SCANNING' ? 'Face ID' : status === 'SUCCESS' ? 'Authenticated' : 'Failed'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
            {status === 'SCANNING' ? 'Veritas Chain Request' : 'Signing Key Access Granted'}
        </p>
        
        {status === 'SCANNING' && (
            <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-4 w-full">
               Sign Transaction
            </div>
        )}

        <button 
            onClick={onCancel}
            className="mt-2 text-sm text-cyan-500 hover:text-cyan-400 font-medium"
        >
            Cancel
        </button>
      </div>
    </div>
  );
};

export default BiometricAuthModal;
