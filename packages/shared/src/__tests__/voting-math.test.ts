import { describe, it, expect } from 'vitest';
import { calculateRequiredThresholds, evaluateVotingEngine } from '../voting-math';

describe('Voting Engine Core Math (BR-03, BR-04, BR-05)', () => {
  it('calculates thresholds correctly for N=10', () => {
    const { required50PercentYes, required30PercentFloorYes } = calculateRequiredThresholds(10);
    expect(required50PercentYes).toBe(5);
    expect(required30PercentFloorYes).toBe(3);
  });

  it('calculates thresholds correctly for N=20', () => {
    const { required50PercentYes, required30PercentFloorYes } = calculateRequiredThresholds(20);
    expect(required50PercentYes).toBe(10);
    expect(required30PercentFloorYes).toBe(6);
  });

  it('approves decision when N=10 and 5 YES votes are cast', () => {
    const result = evaluateVotingEngine(10, 5, 0);
    expect(result.isApproved).toBe(true);
    expect(result.meets50PercentThreshold).toBe(true);
    expect(result.meets30PercentFloor).toBe(true);
  });

  it('rejects decision when N=10 and only 4 YES votes are cast', () => {
    const result = evaluateVotingEngine(10, 4, 0);
    expect(result.isApproved).toBe(false);
    expect(result.meets50PercentThreshold).toBe(false);
  });

  it('handles active voter trap: N=20, 6 active YES votes out of 8 total voters (6/8 YES = 75% voter ratio, but 6 < 10 for 50% joined members)', () => {
    const result = evaluateVotingEngine(20, 6, 2);
    expect(result.isApproved).toBe(false);
    expect(result.meets50PercentThreshold).toBe(false);
    expect(result.meets30PercentFloor).toBe(true);
  });

  it('emits toast message when action fails 30% floor', () => {
    const result = evaluateVotingEngine(20, 4, 1); // 4 YES out of 20 = 20% < 30% floor (requires 6)
    expect(result.isApproved).toBe(false);
    expect(result.toastMessage).toContain('minimum 30% member approval has not been reached');
  });
});
