import axios from 'axios';
import { BIC_STAT_SUBGRAPH_URL } from './constants';


interface ApiResponse<T> {
    data: T;
    errors?: any;
}

interface DepositedEvent {
    depositedAmount: string;
}

interface TransactionUserOp {
    feesByETH: string[];
    feesByBic: string[];
}

interface ChargeFeeEvent {
    _fee: string;
    fee: string;
    sender: string;
}


export async function fetchDeposited(variables: { startAt: number, endAt: number, skip: number }): Promise<DepositedEvent[]> {
    const query = JSON.stringify({
        query: `
            { depositeds(
                where: {
                    blockTimestamp_gte: ${variables.startAt}
                    blockTimestamp_lte: ${variables.endAt}
                }
                first: 10000,
                skip: ${variables.skip},
                orderBy:blockTimestamp, 
                orderDirection:desc
                ) {
                    totalDeposit
                    depositedAmount
                    account
                }
            }
        `,
    });

    try {
        const response = await axios.post(BIC_STAT_SUBGRAPH_URL, query, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data.errors) {
            console.error('GraphQL errors:', response.data.errors);
            return [];
        }

        return response?.data?.data?.depositeds || [];
    } catch (error) {
        console.error('Network error:', error);
        return [];
    }
}


export async function fetchTransactionOp(variables: { startAt: number, endAt: number, skip: number }): Promise<TransactionUserOp[]> {
    const query = JSON.stringify({
        query: `
            { transactionUserOps(
                where: {
                    blockTimestamp_gte: ${variables.startAt}
                    blockTimestamp_lte: ${variables.endAt}
                }
                first: 10000,
                skip: ${variables.skip},
                orderBy:blockTimestamp, 
                orderDirection:desc
                ) {
                    feesByETH
                    feesByBic
                }
            }
        `,
        variables,
    });

    try {
        const response = await axios.post(BIC_STAT_SUBGRAPH_URL, query, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.data.errors) {
            console.error('GraphQL errors:', response.data.errors);
            return [];
        }

        return response?.data?.data?.transactionUserOps || [];
    } catch (error) {
        console.error('Network error:', error);
        return []
    }
}

export const fetchAllTransactionOps = async (variables: { startAt: number, endAt: number }): Promise<TransactionUserOp[]> => {
    try {
        const { startAt, endAt } = variables;
        let data: TransactionUserOp[] = [];
        let skip = 0;
        let loading = true;
        while (loading) {
            const userOps = await fetchTransactionOp({ startAt, endAt, skip });
            data = data.concat(userOps);
            if (userOps.length < 10000) {
                loading = false;
            } else {
                skip += 10000;
            }
        }

        return data;
    } catch (ex) {
        console.log("🚀 ~ fetchAllTransactionOps ~ ex:", ex)
        return [];
    }
}


export const fetchAllDeposited = async (variables: { startAt: number, endAt: number }): Promise<DepositedEvent[]> => {
    try {
        const { startAt, endAt } = variables;
        let data: DepositedEvent[] = [];
        let skip = 0;
        let loading = true;
        while (loading) {
            const fees = await fetchDeposited({ startAt, endAt, skip });
            data = data.concat(fees);
            if (fees.length < 10000) {
                loading = false;
            } else {
                skip += 10000;
            }
        }

        return data;
    } catch (ex) {
        return [];
    }
}

export const fetchAllChargeFees = async (variables: { startAt: number, endAt: number }): Promise<ChargeFeeEvent[]> => {
    try {
        const { startAt, endAt } = variables;
        let data: ChargeFeeEvent[] = [];
        let skip = 0;
        let loading = true;
        while (loading) {
            const fees = await fetchChargeFees({ startAt, endAt, skip });
            data = data.concat(fees);
            if (fees.length < 10000) {
                loading = false;
            } else {
                skip += 10000;
            }
        }

        return data;
    } catch (ex) {
        return [];
    }
}