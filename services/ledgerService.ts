import { ContentRecord, VectorMatchResult, MediaType, TransformationEvent, C2PAManifest, NetworkStats, ValidatorNode, GovernanceProposal, Partner, TreasuryAllocation, SecureKeyMetadata } from '../types';

// --- Veritas Core Library (VCL) Simulation ---

// Helper: Determine media type from file
export const getMediaType = (file: File): MediaType => {
  if (file.type.startsWith('video/')) return 'VIDEO';
  if (file.type.startsWith('audio/')) return 'AUDIO';
  return 'IMAGE';
};

// Helper: Buffer to Hex
const bufToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const stringToHash = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return bufToHex(hashBuffer);
};

// VCL: Merkle Tree Hashing (Phase 3)
export const computeMerkleRoot = async (file: File): Promise<string> => {
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  const hashes: string[] = [];

  // 1. Hash Chunks (Leaves)
  for (let i = 0; i < chunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    const buffer = await chunk.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    hashes.push(bufToHex(hashBuffer));
  }

  // 2. Build Tree to Root
  if (hashes.length === 0) return "";
  if (hashes.length === 1) return hashes[0];

  const combined = new TextEncoder().encode(hashes.join(''));
  const rootBuffer = await crypto.subtle.digest('SHA-256', combined);
  return bufToHex(rootBuffer);
};

// VCL: Phase 2 AI Fingerprinting (PRNU / Image)
export const computePRNUFingerprint = async (file: File): Promise<number[]> => {
  const buffer = await file.slice(0, 10000).arrayBuffer(); 
  const view = new Uint8Array(buffer);
  const vectorSize = 128;
  const vector: number[] = new Array(vectorSize).fill(0);
  for (let i = 0; i < view.length; i++) vector[i % vectorSize] += view[i];
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / (magnitude || 1));
};

// VCL: Phase 3 Temporal Fingerprinting (Video)
export const computeTemporalFingerprint = async (file: File): Promise<number[]> => {
  const vectorSize = 128;
  const vector: number[] = new Array(vectorSize).fill(0.5); 
  const magicNumber = file.size % 255;
  vector[0] = magicNumber / 255;
  vector[10] = (magicNumber * 2 % 255) / 255;
  return vector;
};

// VCL: Phase 3 Acoustic Fingerprint (Audio)
export const computeAudioFingerprint = async (file: File): Promise<number[]> => {
   const vectorSize = 128;
   const vector: number[] = new Array(vectorSize).fill(0.1);
   const magicNumber = file.size % 255;
   vector[5] = magicNumber / 255; 
   vector[20] = 0.8; 
   return vector;
};

// Mock ECDSA Signing
const generateMockSignature = (hash: string): string => {
  const entropy = Math.random().toString(36).substring(2);
  return `ecdsa_sig_0x${hash.substring(0, 8)}...${entropy}`;
};

// Math: Cosine Similarity
const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * val, 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB || 1);
};

// --- Phase 4 & 5: Fee & C2PA Logic ---

export const calculateNetworkFee = (fileSize: number, isDerivative: boolean): number => {
    // Base fee + size fee
    const baseFee = 0.002; // VRT
    const sizeFee = (fileSize / (1024 * 1024)) * 0.0001; // VRT per MB
    const typeMult = isDerivative ? 1.2 : 1.0; // Derivatives cost slightly more to process audit trail
    return parseFloat(((baseFee + sizeFee) * typeMult).toFixed(5));
};

const generateC2PAManifest = (
    title: string, 
    hash: string, 
    author: string, 
    transformations?: TransformationEvent[]
): C2PAManifest => {
    const assertions = [
        {
            label: "c2pa.actions",
            data: {
                actions: transformations ? transformations.map(t => ({
                    action: t.action.toLowerCase(),
                    softwareAgent: t.tool_signature,
                    when: new Date(t.timestamp).toISOString()
                })) : [{ action: "c2pa.created", when: new Date().toISOString() }]
            }
        },
        {
            label: "stds.schema-org.CreativeWork",
            data: {
                "@context": "http://schema.org/",
                "@type": "CreativeWork",
                "author": [{ "@type": "Person", "name": author }],
                "identifier": hash
            }
        }
    ];

    return {
        claim_generator: "Veritas Chain VCL v4.0",
        format: "application/c2pa",
        instance_id: `urn:uuid:${crypto.randomUUID()}`,
        title: title,
        assertions: assertions,
        signature_info: {
            issuer: "Veritas Trust Anchor CA",
            time: new Date().toISOString()
        }
    };
};

// --- Secure Enclave Simulation (Phase 2) ---

let simulatedSecureKey: SecureKeyMetadata | null = null;

export const generateSecureEnclaveKey = async (ownerName: string): Promise<SecureKeyMetadata> => {
    // Simulate hardware delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newKey: SecureKeyMetadata = {
        keyId: `k_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        hardwareType: 'APPLE_SECURE_ENCLAVE',
        creationTime: Date.now(),
        isExportable: false,
        ownerName
    };
    simulatedSecureKey = newKey;
    return newKey;
};

export const getSecureKeyMetadata = (): SecureKeyMetadata | null => {
    return simulatedSecureKey;
};

export const simulateBiometricSign = async (): Promise<boolean> => {
    // Simulate system prompt delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true; // Always success in mock
}

// --- DLT / Smart Contract Mock ---

const LEDGER_STATE: Record<string, ContentRecord> = {};
const VECTOR_INDEX: { 
  type: MediaType; 
  vector: number[]; 
  hash: string 
}[] = [];

// Mock Network State (Phase 5)
export const getNetworkStats = (): NetworkStats => ({
    tps: 2104,
    blockHeight: 1240592,
    activeNodes: 156,
    treasuryBalanceVRT: 850290.45,
    gasPrice: 0.00005
});

export const getValidators = (): ValidatorNode[] => [
    { id: 'val_1', name: 'Veritas Foundation 01', status: 'ONLINE', latency: 12, uptime: 99.99 },
    { id: 'val_2', name: 'News Corp Node', status: 'ONLINE', latency: 24, uptime: 99.95 },
    { id: 'val_3', name: 'EU Media Trust', status: 'ONLINE', latency: 45, uptime: 99.82 },
    { id: 'val_4', name: 'Asia Pacific Ledger', status: 'SYNCING', latency: 110, uptime: 98.50 },
    { id: 'val_5', name: 'Community Node Alpha', status: 'ONLINE', latency: 32, uptime: 99.10 },
];

export const getProposals = (): GovernanceProposal[] => [
    { 
        id: 'prop_201', 
        title: 'Onboard Partner: Nikon Corp', 
        type: 'PARTNER_ONBOARDING', 
        votingMechanism: 'MULTI_SIG',
        description: 'Whitelist Nikon secure enclave keys for Z9 series cameras. Requires 3/5 Delegate signatures.',
        votesFor: 0, 
        votesAgainst: 0, 
        signaturesCollected: 2,
        signaturesRequired: 5,
        status: 'ACTIVE', 
        endDate: '2025-09-15',
        proposer: '0x7a...39b'
    },
    { 
        id: 'prop_199', 
        title: 'Core Protocol Upgrade v5.1', 
        type: 'PROTOCOL_UPGRADE', 
        votingMechanism: 'QUADRATIC',
        description: 'Optimize Merkle Tree validation gas costs. 48-hour Time-Lock active upon passing.',
        votesFor: 84000, 
        quadraticVotesFor: 290, // Sqrt(84000) approx
        votesAgainst: 5000, 
        status: 'TIMELOCK_PENDING', 
        endDate: '2025-08-10',
        proposer: 'Veritas Foundation'
    },
    { 
        id: 'prop_198', 
        title: 'Ecosystem Grant: Rust SDK', 
        type: 'FEE_UPDATE', 
        votingMechanism: 'SNAPSHOT',
        description: 'Allocating 50k VRT to external dev team for Rust bindings.',
        votesFor: 45000, 
        votesAgainst: 42000, 
        status: 'PASSED', 
        endDate: '2025-09-01',
        proposer: 'DAO Member 0x2c'
    }
];

export const getPartners = (): Partner[] => [
    { id: 'p1', name: 'Sony Electronics', type: 'HARDWARE', status: 'INTEGRATED', details: 'Firmware v3.0+ supports VCL signing natively.', logoInitial: 'S' },
    { id: 'p2', name: 'Reuters', type: 'MEDIA', status: 'INTEGRATED', details: 'Global CMS auto-verification live.', logoInitial: 'R' },
    { id: 'p3', name: 'Adobe', type: 'SOFTWARE', status: 'BETA', details: 'Creative Cloud C2PA Plugin in public beta.', logoInitial: 'A' },
    { id: 'p4', name: 'Canon', type: 'HARDWARE', status: 'PENDING', details: 'Governance vote pending for key whitelisting.', logoInitial: 'C' },
    { id: 'p5', name: 'X (Twitter)', type: 'MEDIA', status: 'INTEGRATED', details: 'Displaying Veritas Score on timeline.', logoInitial: 'X' },
];

export const getTreasuryAllocation = (): TreasuryAllocation[] => [
    { category: 'R&D / Protocol Dev', amount: 40, color: '#06b6d4' }, // Cyan
    { category: 'Security Audits', amount: 25, color: '#8b5cf6' },     // Purple
    { category: 'Ecosystem Grants', amount: 20, color: '#10b981' },    // Emerald
    { category: 'Operations', amount: 15, color: '#f59e0b' },          // Amber
];

/**
 * ProvenanceManager: RegisterContent
 */
export const registerContentOnChain = async (
  file: File,
  author: string, 
  deviceModel: string
): Promise<ContentRecord> => {
  const mediaType = getMediaType(file);
  const hash = await computeMerkleRoot(file);
  
  let prnu: number[] | undefined;
  let temporal: number[] | undefined;
  let audio: number[] | undefined;

  if (mediaType === 'IMAGE') prnu = await computePRNUFingerprint(file);
  if (mediaType === 'VIDEO') {
      temporal = await computeTemporalFingerprint(file);
      audio = await computeAudioFingerprint(file);
  }
  if (mediaType === 'AUDIO') audio = await computeAudioFingerprint(file);
  
  const txId = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Use mock secure key if available, else default
  const secureKey = getSecureKeyMetadata();
  const keyId = secureKey ? `${secureKey.keyId} (${secureKey.hardwareType})` : `pub_key_${deviceModel.replace(/\s/g, '_')}_GENERIC`;
  
  const fee = calculateNetworkFee(file.size, false);

  // Phase 5: Generate C2PA and Anchored Digest
  const manifest = generateC2PAManifest(file.name, hash, author);
  const manifestDigest = await stringToHash(JSON.stringify(manifest));

  const newRecord: ContentRecord = {
    content_hash: hash,
    signing_key_id: keyId,
    timestamp: Date.now(),
    signature: generateMockSignature(hash),
    media_type: mediaType,
    provenance_link: txId,
    device_fingerprint: prnu,
    temporal_fingerprint: temporal,
    audio_fingerprint: audio,
    network_fee_paid: `${fee} VRT`,
    c2pa_manifest: manifest,
    manifest_digest: manifestDigest,
    metadata: {
      author: author,
      action: 'CAPTURE',
      details: 'Original capture registered via Veritas Creator SDK.',
      location: '37.7749° N, 122.4194° W',
      device_model: deviceModel,
      duration: mediaType !== 'IMAGE' ? '00:00:15' : undefined,
      resolution: mediaType === 'VIDEO' ? '4K 60fps' : undefined,
      codec: mediaType === 'VIDEO' ? 'H.265' : undefined
    }
  };

  LEDGER_STATE[hash] = newRecord;
  
  if (prnu) VECTOR_INDEX.push({ type: 'IMAGE', vector: prnu, hash });
  if (temporal) VECTOR_INDEX.push({ type: 'VIDEO', vector: temporal, hash });
  if (audio && mediaType === 'AUDIO') VECTOR_INDEX.push({ type: 'AUDIO', vector: audio, hash });
  
  return newRecord;
};

export const verifyContentOnChain = async (file: File): Promise<{ 
  record: ContentRecord | null, 
  vectorMatch: VectorMatchResult, 
  manifestIntegrity: boolean 
}> => {
  const hash = await computeMerkleRoot(file);
  const record = LEDGER_STATE[hash] || null;
  
  // Vector matching
  let vectorMatch: VectorMatchResult = { matchFound: false, similarityScore: 0, matchType: 'NONE' };
  const mediaType = getMediaType(file);
  
  let queryVector: number[] | undefined;
  if (mediaType === 'IMAGE') queryVector = await computePRNUFingerprint(file);
  else if (mediaType === 'VIDEO') queryVector = await computeTemporalFingerprint(file);
  else if (mediaType === 'AUDIO') queryVector = await computeAudioFingerprint(file);

  if (queryVector) {
      let bestScore = 0;
      let bestMatch: ContentRecord | undefined;
      
      for (const entry of VECTOR_INDEX) {
          if (entry.type !== mediaType) continue;
          const score = calculateCosineSimilarity(queryVector, entry.vector);
          if (score > bestScore) {
              bestScore = score;
              bestMatch = LEDGER_STATE[entry.hash];
          }
      }
      
      if (bestScore > 0.85) {
          vectorMatch = {
              matchFound: true,
              similarityScore: bestScore,
              matchedRecord: bestMatch,
              matchType: bestMatch?.content_hash === hash ? 'EXACT' : 'DERIVATIVE'
          };
      }
  }

  // Verify Manifest Anchor if record exists
  let manifestIntegrity = false;
  if (record && record.c2pa_manifest && record.manifest_digest) {
      const currentDigest = await stringToHash(JSON.stringify(record.c2pa_manifest));
      manifestIntegrity = currentDigest === record.manifest_digest;
  }

  return { record, vectorMatch, manifestIntegrity };
};

export const registerDerivativeOnChain = async (
  file: File, 
  parentHash: string, 
  author: string, 
  transformations: TransformationEvent[]
): Promise<ContentRecord> => {
  const mediaType = getMediaType(file);
  const hash = await computeMerkleRoot(file);
  
  let prnu: number[] | undefined;
  let temporal: number[] | undefined;
  let audio: number[] | undefined;

  if (mediaType === 'IMAGE') prnu = await computePRNUFingerprint(file);
  if (mediaType === 'VIDEO') {
      temporal = await computeTemporalFingerprint(file);
      audio = await computeAudioFingerprint(file);
  }
  if (mediaType === 'AUDIO') audio = await computeAudioFingerprint(file);

  const txId = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const secureKey = getSecureKeyMetadata();
  const keyId = secureKey ? `${secureKey.keyId} (${secureKey.hardwareType})` : `pub_key_${author.replace(/\s/g, '_')}_DERIV`;

  const fee = calculateNetworkFee(file.size, true);
  
  const manifest = generateC2PAManifest(file.name, hash, author, transformations);
  const manifestDigest = await stringToHash(JSON.stringify(manifest));

  const newRecord: ContentRecord = {
    content_hash: hash,
    signing_key_id: keyId,
    timestamp: Date.now(),
    signature: generateMockSignature(hash),
    media_type: mediaType,
    provenance_link: txId,
    parent_hash: parentHash,
    transformations: transformations,
    device_fingerprint: prnu,
    temporal_fingerprint: temporal,
    audio_fingerprint: audio,
    network_fee_paid: `${fee} VRT`,
    c2pa_manifest: manifest,
    manifest_digest: manifestDigest,
    metadata: {
      author: author,
      action: 'EDIT',
      details: 'Derivative work registered via Veritas Creator SDK.',
      device_model: 'Workstation Pro / Veritas Plugin',
    }
  };

  LEDGER_STATE[hash] = newRecord;
  
  if (prnu) VECTOR_INDEX.push({ type: 'IMAGE', vector: prnu, hash });
  if (temporal) VECTOR_INDEX.push({ type: 'VIDEO', vector: temporal, hash });
  if (audio && mediaType === 'AUDIO') VECTOR_INDEX.push({ type: 'AUDIO', vector: audio, hash });

  return newRecord;
};

export const getMockParentHash = (): string => {
    const mockHash = "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890";
    if (!LEDGER_STATE[mockHash]) {
         LEDGER_STATE[mockHash] = {
            content_hash: mockHash,
            signing_key_id: "pub_key_SONY_A7_IV_GENERIC",
            timestamp: Date.now() - 1000000,
            signature: generateMockSignature(mockHash),
            media_type: "IMAGE",
            provenance_link: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            metadata: {
                author: "Original Creator",
                action: "CAPTURE",
                details: "Original Source",
                device_model: "Sony A7 IV"
            }
         }
    }
    return mockHash;
};