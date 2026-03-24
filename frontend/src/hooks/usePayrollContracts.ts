import type { ContractType } from '../services/contracts.types';
import { useSorobanContract } from './useSorobanContract';

export interface BulkPaymentResult {
  totalRecipients: number;
  successfulPayments: number;
  failedPayments: number;
  transactionHash: string;
}

export interface VestingScheduleResult {
  scheduleId: string;
  beneficiary: string;
  totalAmount: string;
  startTime: number;
  endTime: number;
  releasedAmount: string;
}

export interface RevenueSplitResult {
  roundId: string;
  totalDistributed: string;
  participantCount: number;
  transactionHash: string;
}

function parseBulkPaymentResult(raw: unknown): BulkPaymentResult {
  const data = raw as Record<string, unknown>;
  const totalRecipients = data?.totalRecipients;
  const successfulPayments = data?.successfulPayments;
  const failedPayments = data?.failedPayments;
  const transactionHash = data?.transactionHash;
  return {
    totalRecipients: typeof totalRecipients === 'number' ? totalRecipients : 0,
    successfulPayments: typeof successfulPayments === 'number' ? successfulPayments : 0,
    failedPayments: typeof failedPayments === 'number' ? failedPayments : 0,
    transactionHash: typeof transactionHash === 'string' ? transactionHash : '',
  };
}

function parseVestingScheduleResult(raw: unknown): VestingScheduleResult {
  const data = raw as Record<string, unknown>;
  const scheduleId = data?.scheduleId;
  const beneficiary = data?.beneficiary;
  const totalAmount = data?.totalAmount;
  const startTime = data?.startTime;
  const endTime = data?.endTime;
  const releasedAmount = data?.releasedAmount;
  return {
    scheduleId: typeof scheduleId === 'string' ? scheduleId : '',
    beneficiary: typeof beneficiary === 'string' ? beneficiary : '',
    totalAmount: typeof totalAmount === 'string' ? totalAmount : '0',
    startTime: typeof startTime === 'number' ? startTime : 0,
    endTime: typeof endTime === 'number' ? endTime : 0,
    releasedAmount: typeof releasedAmount === 'string' ? releasedAmount : '0',
  };
}

function parseRevenueSplitResult(raw: unknown): RevenueSplitResult {
  const data = raw as Record<string, unknown>;
  const roundId = data?.roundId;
  const totalDistributed = data?.totalDistributed;
  const participantCount = data?.participantCount;
  const transactionHash = data?.transactionHash;
  return {
    roundId: typeof roundId === 'string' ? roundId : '',
    totalDistributed: typeof totalDistributed === 'string' ? totalDistributed : '0',
    participantCount: typeof participantCount === 'number' ? participantCount : 0,
    transactionHash: typeof transactionHash === 'string' ? transactionHash : '',
  };
}

export function useBulkPaymentContract(contractId: string) {
  const baseHook = useSorobanContract<BulkPaymentResult>(contractId);

  const distribute = async (args: { recipients: string[]; amounts: string[]; asset?: string }) => {
    return baseHook.invoke({
      method: 'distribute',
      args: [args.recipients, args.amounts, args.asset ?? null],
      parseResult: parseBulkPaymentResult,
    });
  };

  const getPaymentStatus = async (paymentId: string) => {
    return baseHook.invoke({
      method: 'get_payment_status',
      args: [paymentId],
      parseResult: (raw) => raw as { status: string; amount: string; timestamp: number },
    });
  };

  return {
    ...baseHook,
    distribute,
    getPaymentStatus,
  };
}

export function useVestingEscrowContract(contractId: string) {
  const baseHook = useSorobanContract<VestingScheduleResult>(contractId);

  const createSchedule = async (args: {
    beneficiary: string;
    amount: string;
    startTime: number;
    endTime: number;
    cliffDuration?: number;
  }) => {
    return baseHook.invoke({
      method: 'create_vesting_schedule',
      args: [
        args.beneficiary,
        args.amount,
        BigInt(args.startTime),
        BigInt(args.endTime),
        BigInt(args.cliffDuration ?? 0),
      ],
      parseResult: parseVestingScheduleResult,
    });
  };

  const release = async (scheduleId: string) => {
    return baseHook.invoke({
      method: 'release',
      args: [scheduleId],
      parseResult: parseVestingScheduleResult,
    });
  };

  const getSchedule = async (scheduleId: string) => {
    return baseHook.invoke({
      method: 'get_schedule',
      args: [scheduleId],
      parseResult: parseVestingScheduleResult,
    });
  };

  return {
    ...baseHook,
    createSchedule,
    release,
    getSchedule,
  };
}

export function useRevenueSplitContract(contractId: string) {
  const baseHook = useSorobanContract<RevenueSplitResult>(contractId);

  const createRound = async (args: {
    totalPrize: string;
    participants: string[];
    weights?: number[];
  }) => {
    return baseHook.invoke({
      method: 'create_round',
      args: [args.totalPrize, args.participants, args.weights ?? []],
      parseResult: parseRevenueSplitResult,
    });
  };

  const distribute = async (roundId: string) => {
    return baseHook.invoke({
      method: 'distribute',
      args: [roundId],
      parseResult: parseRevenueSplitResult,
    });
  };

  const getRoundStatus = async (roundId: string) => {
    return baseHook.invoke({
      method: 'get_round_status',
      args: [roundId],
      parseResult: (raw) =>
        raw as { status: string; totalDistributed: string; participantCount: number },
    });
  };

  return {
    ...baseHook,
    createRound,
    distribute,
    getRoundStatus,
  };
}

export type PayrollContractHook<T = unknown> = ReturnType<typeof useSorobanContract<T>>;

export function getPayrollContractHook(contractType: ContractType) {
  switch (contractType) {
    case 'bulk_payment':
      return useBulkPaymentContract;
    case 'vesting_escrow':
      return useVestingEscrowContract;
    case 'revenue_split':
      return useRevenueSplitContract;
    default:
      return useSorobanContract;
  }
}
