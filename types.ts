
export enum VerificationStatus {
  VERIFIED = 'VERIFIED',           // Hash Match + Vector Match
  TAMPERED = 'TAMPERED',           // Hash Mismatch + Vector Match (Source Identified but content changed)
  SUSPECT = 'SUSPECT',             // Hash Match + Vector Mismatch (Anomaly)
  UNVERIFIED = 'UNVERIFIED',       // No Record Found
  ANALYZING = 'ANALYZING'
}

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export interface TransformationEvent {
  timestamp: number;
  action: 'CROP' | 'TRIM' | 'FILTER' | 'COMPRESSION' | 'AUDIO_MIX' | 'DERIVATIVE';
  details: string;
  tool_signature: string;
}

// Phase 4: C2PA Standard Types
export interface C2PAAssertion {
  label: string;
  data: Record<string, any>;
}

export interface C2PAManifest {
  claim_generator: string; // "Veritas Chain v1.0"
  format: string;          // "application/c2pa"
  instance_id: string;
  title: string;
  assertions: C2PAAssertion[];
  signature_info: {
    issuer: string;
    time: string;
  };
}

// Phase 3 & 4: Video & Audio Provenance Schema
export interface ContentRecord {
  content_hash: string;       // SHA-256 (Primary Key) OR Merkle Root for large files
  signing_key_id: string;     // Public Key ID
  timestamp: number;          // Unix Timestamp
  signature: string;          // ECDSA Signature
  media_type: MediaType;
  
  // Provenance Graph / Audit Trail
  provenance_link: string;    // Transaction ID
  parent_hash?: string;       // If this is a derivative, points to original
  transformations?: TransformationEvent[]; // Audit trail of changes

  // Phase 4: C2PA Manifest
  c2pa_manifest?: C2PAManifest;
  
  // Phase 5: C2PA Immutable Anchor
  manifest_digest?: string;   // SHA-256 of the C2PA Manifest JSON (The Anchor)
  
  network_fee_paid?: string; // e.g., "0.005 VRT"

  // Forensics (Phase 2 & 3)
  device_fingerprint?: number[];   // PRNU (Image)
  temporal_fingerprint?: number[]; // Video Temporal Consistency
  audio_fingerprint?: number[];    // Audio Acoustic Signature

  // Technical Metadata
  metadata?: {
    author: string;
    action: 'CAPTURE' | 'EDIT' | 'PUBLISH';
    details: string;
    location?: string;
    device_model?: string;
    duration?: string;
    resolution?: string;
    codec?: string;
  }
}

export interface VectorMatchResult {
  matchFound: boolean;
  similarityScore: number; // 0.0 to 1.0
  matchedRecord?: ContentRecord;
  matchType: 'EXACT' | 'DERIVATIVE' | 'NONE';
}

export interface AnalysisResult {
  veritasScore: number; // Composite Trust Score (0-100)
  blockchainMatch: boolean;
  vectorMatch: VectorMatchResult;
  record: ContentRecord | null;
  aiReasoning: string; // Visual forensics summary
  visualScore: number; // Gemini visual score
  status: VerificationStatus;
  mediaType: MediaType;
  manifestIntegrity?: boolean; // Phase 5: Did the C2PA anchor match?
}

export interface GeminiAnalysisResponse {
  authenticityScore: number;
  detectedAnomalies: string[];
  lightingConsistency: string;
  noisePatternAnalysis: string;
  conclusion: string;
}

// Phase 4 & 5: Governance & Ecosystem Types
export interface ValidatorNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'SYNCING' | 'OFFLINE';
  latency: number;
  uptime: number; // percentage
}

export type VotingMechanism = 'QUADRATIC' | 'MULTI_SIG' | 'SNAPSHOT' | 'SIMPLE_MAJORITY';

export interface GovernanceProposal {
  id: string;
  title: string;
  type: 'KEY_REVOCATION' | 'FEE_UPDATE' | 'PROTOCOL_UPGRADE' | 'PARTNER_ONBOARDING';
  votingMechanism: VotingMechanism;
  description: string;
  
  // Voting Data
  votesFor: number;
  votesAgainst: number;
  quadraticVotesFor?: number; // For Quadratic Voting
  signaturesCollected?: number; // For Multi-Sig (e.g., 3 of 5)
  signaturesRequired?: number;
  
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'TIMELOCK_PENDING';
  endDate: string;
  proposer: string;
}

export interface NetworkStats {
  tps: number;
  blockHeight: number;
  activeNodes: number;
  treasuryBalanceVRT: number;
  gasPrice: number; // In VRT
}

// Phase 5: Strategic Partners & Treasury
export interface Partner {
  id: string;
  name: string;
  type: 'HARDWARE' | 'MEDIA' | 'SOFTWARE';
  status: 'INTEGRATED' | 'BETA' | 'PENDING';
  details: string;
  logoInitial: string;
}

export interface TreasuryAllocation {
  category: string;
  amount: number;
  color: string;
}

// --- SECURE ENCLAVE TYPES (Phase 2 Update) ---
export type KeyStorageStatus = 'UNINITIALIZED' | 'GENERATING' | 'READY';

export interface SecureKeyMetadata {
    keyId: string;
    hardwareType: 'APPLE_SECURE_ENCLAVE' | 'ANDROID_STRONGBOX' | 'TPM_2.0';
    creationTime: number;
    isExportable: false; // Always false
    ownerName: string;
}
