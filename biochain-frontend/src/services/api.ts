// Centralized API client service for KhetiNex BioChain

const BASE_URL = 'http://localhost:8000';

export interface ArbitrageResponse {
  crop: string;
  source: string;
  best_market: string;
  quantity_kg: number;
  gross_revenue: number;
  transport_cost: number;
  net_profit: number;
  coords: [number, number];
  profit: number;
  market: string;
  details: string;
}

export interface CorridorInfo {
  corridor: string;
  distance_km: number;
  transit_hours: number;
  status: string;
  cost_inr: number;
}

export interface LogisticsResponse {
  active_fleets: number;
  cold_storage_units: number;
  avg_freight_per_km: number;
  monitored_corridors: CorridorInfo[];
}

export interface ContractPayload {
  fpo: string;
  buyer: string;
  crop: string;
  tons: number;
}

export interface ContractResponse {
  contract: string;
  status: string;
  engine: string;
  contract_id: number;
}

export interface VerificationResponse {
  id: number;
  trustScore: number;
  isVerified: boolean;
}

export interface RecommendationResponse {
  bestCrop: {
    name: string;
    score: number;
  };
  bestBuyer: {
    name: string;
    pricePremium: number;
    qualityReq: number;
    distance: number;
  };
}

export interface ChatResponse {
  agent_thought: string;
  agent_message: string;
  action_type: string;
  payload: any;
}

export const getArbitrage = async (
  crop: string,
  fpoLocation: string,
  quantityKg: number = 1000
): Promise<ArbitrageResponse> => {
  const url = `${BASE_URL}/api/arbitrage?crop=${encodeURIComponent(crop)}&fpo_location=${encodeURIComponent(fpoLocation)}&quantity_kg=${quantityKg}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch arbitrage data: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const getLogistics = async (): Promise<LogisticsResponse> => {
  const response = await fetch(`${BASE_URL}/api/logistics`);
  if (!response.ok) {
    throw new Error(`Failed to fetch logistics data: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const generateContract = async (data: ContractPayload): Promise<ContractResponse> => {
  const response = await fetch(`${BASE_URL}/api/contract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to generate contract: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const verifyBioChain = async (payload: { ndvi_value?: number } = {}): Promise<VerificationResponse> => {
  const response = await fetch(`${BASE_URL}/api/biochain/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to verify biochain data: ${response.status}`);
  }
  return await response.json();
};

export const getBioChainRecommendations = async (payload: any = {}): Promise<RecommendationResponse> => {
  const response = await fetch(`${BASE_URL}/api/biochain/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch recommendations: ${response.status}`);
  }
  return await response.json();
};

export const sendAgentChat = async (message: string): Promise<ChatResponse> => {
  const response = await fetch(`${BASE_URL}/api/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error(`Failed to send agent chat: ${response.status}`);
  }
  return await response.json();
};
