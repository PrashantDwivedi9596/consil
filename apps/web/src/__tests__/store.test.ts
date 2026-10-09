import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../lib/store';
import { RoomType, PrivacyMode } from '@council/shared';

describe('Frontend Zustand Store (Stage 1 UI State)', () => {
  beforeEach(() => {
    useAppStore.setState({
      activeRoomId: 'room-1',
      toasts: [],
    });
  });

  it('adds a mock room successfully', () => {
    const store = useAppStore.getState();
    store.createRoomMock({
      name: 'Test UI Room',
      isSavedAtCreation: true,
      isPrivate: false,
    });

    const updatedRooms = useAppStore.getState().rooms;
    expect(updatedRooms[0].name).toBe('Test UI Room');
    expect(updatedRooms[0].roomType).toBe(RoomType.PERSISTENT);
  });

  it('triggers warning toast when vote falls below 30% floor', () => {
    const store = useAppStore.getState();
    store.castVoteMock('vote-save-101', 'YES');

    const toasts = useAppStore.getState().toasts;
    expect(toasts.length).toBeGreaterThan(0);
  });
});
