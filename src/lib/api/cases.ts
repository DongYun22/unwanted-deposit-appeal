import { makeMockReport, mockAnalysis, mockTransfers } from "@/mocks/case";
import type {
  CaseAnalysis,
  CaseReport,
  RequestContext,
  Transfer,
  UserStatement,
} from "@/types/case";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("MOCK_MODE");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  return response.json() as Promise<T>;
}

const pause = (duration = 480) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export async function getInboundTransfers(address: string): Promise<Transfer[]> {
  if (API_BASE_URL) {
    const data = await request<{ transfers: Transfer[] }>("/api/wallets/inbound-transfers", {
      method: "POST",
      body: JSON.stringify({ chainId: 1, address }),
    });
    return data.transfers;
  }

  await pause();
  return mockTransfers;
}

export async function analyzeCase(input: {
  context: RequestContext;
  walletAddress: string;
  transfer: Transfer;
}): Promise<CaseAnalysis> {
  if (API_BASE_URL) {
    return request<CaseAnalysis>("/api/cases/analyze", {
      method: "POST",
      body: JSON.stringify({
        exchange: input.context.exchange,
        requestType: input.context.requestType,
        walletAddress: input.walletAddress,
        txHash: input.transfer.txHash,
      }),
    });
  }

  await pause(760);
  return mockAnalysis;
}

export async function createReport(input: {
  context: RequestContext;
  walletAddress: string;
  transfer: Transfer;
  analysis: CaseAnalysis;
  statement: UserStatement;
  includedEvidenceIds: string[];
}): Promise<CaseReport> {
  if (API_BASE_URL) {
    return request<CaseReport>("/api/cases/report", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  await pause(520);
  return makeMockReport(input.statement);
}
