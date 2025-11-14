// api/types.ts
export interface RecognizeResponse {
  id: string;
  name: string;
  image: string;
  confidence: number;
  description: string;
}

export interface ChatResponse {
  reply: string;
}