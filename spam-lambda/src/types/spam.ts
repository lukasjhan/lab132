export interface SpamHadlerBody {
  content: string;
  spamLinkDomains: string[];
  redirectionDepth: number;
}

export interface SpamHadlerResponse {
  isSpam: boolean;
}