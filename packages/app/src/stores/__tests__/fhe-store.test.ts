import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockInitialize } = vi.hoisted(() => ({
  mockInitialize: vi.fn(),
}));

vi.mock('@/services/FheService', () => ({
  fheService: {
    initialize: mockInitialize,
  },
}));

import { useFheStore } from '@/stores/fhe-store';

describe('useFheStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFheStore.setState({
      initialized: false,
      initializing: false,
      error: null,
    });
  });

  it('has correct initial state', () => {
    const state = useFheStore.getState();

    expect(state.initialized).toBe(false);
    expect(state.initializing).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets initialized to true on successful initialize', async () => {
    mockInitialize.mockResolvedValueOnce(undefined);

    await useFheStore.getState().initialize('0xabc');

    const state = useFheStore.getState();
    expect(state.initialized).toBe(true);
    expect(state.initializing).toBe(false);
    expect(state.error).toBeNull();
    expect(mockInitialize).toHaveBeenCalledWith('0xabc');
  });

  it('sets error on failed initialize', async () => {
    mockInitialize.mockRejectedValueOnce(new Error('FHE init failed'));

    await useFheStore.getState().initialize('0xabc');

    const state = useFheStore.getState();
    expect(state.initialized).toBe(false);
    expect(state.initializing).toBe(false);
    expect(state.error).toBe('FHE init failed');
  });

  it('is idempotent when already initialized', async () => {
    mockInitialize.mockResolvedValueOnce(undefined);

    await useFheStore.getState().initialize('0xabc');
    await useFheStore.getState().initialize('0xabc');

    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });

  it('is idempotent when currently initializing', async () => {
    let resolveInit!: () => void;
    mockInitialize.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveInit = resolve;
        }),
    );

    const first = useFheStore.getState().initialize('0xabc');
    const second = useFheStore.getState().initialize('0xabc');

    expect(useFheStore.getState().initializing).toBe(true);

    resolveInit();
    await first;
    await second;

    expect(mockInitialize).toHaveBeenCalledTimes(1);
  });
});
