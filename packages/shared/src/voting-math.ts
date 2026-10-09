/**
 * Authoritative voting threshold evaluation according to SRS Business Rules BR-03, BR-04, and BR-05.
 */

export interface VotingResult {
  eligibleMemberSnapshot: number; // N = total joined members snapshot
  yesCount: number;
  noCount: number;
  required50PercentYes: number; // ceil(N * 0.50)
  required30PercentFloorYes: number; // ceil(N * 0.30)
  meets50PercentThreshold: boolean;
  meets30PercentFloor: boolean;
  isApproved: boolean;
  isBlockedBy30PercentFloor: boolean;
  toastMessage?: string;
}

export function calculateRequiredThresholds(N: number): {
  required50PercentYes: number;
  required30PercentFloorYes: number;
} {
  if (N <= 0) {
    throw new Error('Eligible member denominator N must be a positive integer.');
  }
  return {
    required50PercentYes: Math.ceil(N * 0.50),
    required30PercentFloorYes: Math.ceil(N * 0.30),
  };
}

export function evaluateVotingEngine(
  eligibleMemberSnapshot: number,
  yesCount: number,
  noCount: number,
): VotingResult {
  const N = eligibleMemberSnapshot;
  const { required50PercentYes, required30PercentFloorYes } = calculateRequiredThresholds(N);

  const meets50PercentThreshold = yesCount >= required50PercentYes;
  const meets30PercentFloor = yesCount >= required30PercentFloorYes;

  // Final approval requires BOTH conditions (BR-03 and BR-04)
  const isApproved = meets50PercentThreshold && meets30PercentFloor;

  // Check if active voters approved ratio-wise, but total YES failed the 30% floor
  const totalVotesCast = yesCount + noCount;
  const voterRatioApproved = totalVotesCast > 0 && yesCount / totalVotesCast >= 0.50;
  const isBlockedBy30PercentFloor = voterRatioApproved && !meets30PercentFloor;

  let toastMessage: string | undefined = undefined;
  if (isBlockedBy30PercentFloor || (!meets30PercentFloor && yesCount > 0)) {
    toastMessage = 'Action not completed — the minimum 30% member approval has not been reached.';
  }

  return {
    eligibleMemberSnapshot: N,
    yesCount,
    noCount,
    required50PercentYes,
    required30PercentFloorYes,
    meets50PercentThreshold,
    meets30PercentFloor,
    isApproved,
    isBlockedBy30PercentFloor,
    toastMessage,
  };
}
