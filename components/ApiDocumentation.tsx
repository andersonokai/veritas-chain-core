
import React from 'react';
import { Terminal, Key, Server, Shield, FileText, AlertCircle, Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, lang = 'bash' }: { code: string; lang?: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-2 mb-4">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed">
        <pre>{code}</pre>
      </div>
    </div>
  );
};

const EndpointBadge = ({ method, path }: { method: string; path: string }) => (
  <div className="flex items-center gap-3 font-mono text-sm mb-4">
    <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase ${
      method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
    }`}>
      {method}
    </span>
    <span className="text-slate-200">{path}</span>
  </div>
);

const ApiDocumentation: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-10 border-b border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Terminal className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Phase 4 Deliverable</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Public Verification API</h2>
        <p className="text-slate-400 max-w-3xl leading-relaxed">
          Integrate Veritas Chain verification directly into your platform. The API is designed for speed and simplicity, 
          focusing on two main endpoints: fast hash-based checks and convenient file-based verification.
        </p>
        <div className="mt-6 flex gap-4">
            <div className="bg-slate-900 px-4 py-2 rounded border border-slate-800 flex items-center gap-2 text-sm text-slate-400">
                <Server className="w-4 h-4" /> Base URL: <span className="text-slate-200 font-mono">https://api.veritas.chain/v1</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Nav / Content */}
        <div className="lg:col-span-9 space-y-12">
            
            {/* Authentication */}
            <section>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" /> 1. Authentication
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                    All requests require an API Key issued via the Developer Portal. Include it in the <code className="text-amber-400 bg-amber-400/10 px-1 rounded">X-API-Key</code> header.
                </p>
                <CodeBlock code="X-API-Key: YOUR_VERITAS_API_KEY_XXXXXXXXXXXX" lang="http" />
            </section>

            {/* Endpoint 1 */}
            <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6">2. Hash-Based Verification</h3>
                <EndpointBadge method="GET" path="/verify/hash/{contentHash}" />
                <p className="text-slate-400 text-sm mb-4">
                    Recommended for high-volume integrators. Calculate the SHA-256 hash (or Merkle Root) locally and verify it against the ledger.
                </p>
                
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 mt-6">Example Request</h4>
                <CodeBlock code={`curl -X GET 'https://api.veritas.chain/v1/verify/hash/a1b2...932' \\
-H 'X-API-Key: YOUR_KEY'`} />

                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 mt-6">Success Response</h4>
                <CodeBlock code={`{
  "status": "Verified",
  "veritas_score": 100,
  "dlt_record_found": true,
  "dlt_anchor": "0x5e2b0a3f...",
  "provenance": {
    "source_key_id": "CERT_AGENCY_NYT_1001",
    "timestamp_utc": "2025-11-20T14:30:00Z",
    "c2pa_digest_match": true
  }
}`} lang="json" />
            </section>

            {/* Endpoint 2 */}
            <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6">3. File Upload Verification</h3>
                <EndpointBadge method="POST" path="/verify/file" />
                <p className="text-slate-400 text-sm mb-4">
                    Convenience endpoint. The server handles hashing, Merkle Tree generation, and AI fingerprinting.
                    <span className="block mt-1 text-amber-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Rate Limited: 1 QPS</span>
                </p>
                
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 mt-6">Example Request</h4>
                <CodeBlock code={`curl -X POST 'https://api.veritas.chain/v1/verify/file' \\
-H 'X-API-Key: YOUR_KEY' \\
-F 'asset=@/path/to/image.jpg'`} />
            </section>

            {/* Endpoint 3 */}
            <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6">4. Audit Trail Retrieval</h3>
                <EndpointBadge method="GET" path="/audit/{dlt_anchor}" />
                <p className="text-slate-400 text-sm mb-4">
                    Retrieve the full Chain of Custody for a verified asset using its Transaction ID.
                </p>
                <CodeBlock code={`{
  "chain_of_custody": [
    {
      "step": 1,
      "action": "c2pa.captured",
      "signed_by": "CERT_DEVICE_CANON_R6"
    },
    {
      "step": 2,
      "action": "c2pa.edited",
      "transformation_log": "Cropped 10%"
    }
  ]
}`} lang="json" />
            </section>

             {/* Error Codes */}
             <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400" /> Error Codes
                </h3>
                <div className="overflow-hidden rounded-lg border border-slate-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 font-medium">
                            <tr>
                                <th className="p-4">Status</th>
                                <th className="p-4">Code</th>
                                <th className="p-4">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-950">
                            <tr>
                                <td className="p-4 text-slate-300">400</td>
                                <td className="p-4 font-mono text-rose-400">VC-4001</td>
                                <td className="p-4 text-slate-400">Invalid hash format or malformed body.</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">401</td>
                                <td className="p-4 font-mono text-rose-400">VC-4011</td>
                                <td className="p-4 text-slate-400">Missing or invalid X-API-Key.</td>
                            </tr>
                            <tr>
                                <td className="p-4 text-slate-300">429</td>
                                <td className="p-4 font-mono text-rose-400">VC-4291</td>
                                <td className="p-4 text-slate-400">Rate limit exceeded. Check headers.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24">
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" /> Quick Links
                    </h4>
                    <nav className="space-y-2 text-sm">
                        <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Authentication</a>
                        <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Hash Verification</a>
                        <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">File Upload</a>
                        <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Audit Trails</a>
                        <a href="#" className="block text-slate-400 hover:text-cyan-400 transition-colors">Error Codes</a>
                    </nav>
                </div>

                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-5">
                    <h4 className="font-bold text-white mb-2">Need Higher Limits?</h4>
                    <p className="text-xs text-slate-400 mb-4">
                        Enterprise plans include dedicated nodes, 100+ QPS, and raw Vector DB access.
                    </p>
                    <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ApiDocumentation;
