
import { API_BASE_URL } from "@/config/env";
import { getAuthToken } from "@/utils/formatUtils";

export interface WalletTransaction {
  _id: string;
  user_id: string;
  type: string;
  direction: "debit" | "credit";
  transaction_type: string;
  amount: number;
  reference: string;
  transaction_id: string;
  currency: string;
  metadata: {
    task_id?: string;
    note?: string;
  };
  status: string;
  task_fee_amount?: number;
  task_fee_percentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistoryData {
  month: string;
  transactions: WalletTransaction[];
}

export interface TransactionHistoryResponse {
  message: string;
  data: TransactionHistoryData[];
  success: boolean;
}

export interface TransactionHistoryParams {
  month?: string;
  year?: number;
  direction?: "debit" | "credit";
}

const walletTransactionApi = {
  // Responder wallet transaction history
  getResponderTransactionHistory: async (
    params: TransactionHistoryParams = {}
  ): Promise<TransactionHistoryResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryParams = new URLSearchParams();
    if (params.month) queryParams.append("month", params.month);
    if (params.year) queryParams.append("year", params.year.toString());
    if (params.direction) queryParams.append("direction", params.direction);

    const response = await fetch(
      `${API_BASE_URL}/responder/wallet-transaction/history?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch responder transaction history: ${response.statusText}`
      );
    }

    return response.json();
  },
};

export default walletTransactionApi;
