// Test setup — mock helpers for API and localStorage

import { vi } from "vitest";

// --- localStorage mock ---
const store = {};
export const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => {
    store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
  }),
};

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

// --- Mock API builder ---
// Creates a mock axios-like instance that records calls for assertion.
export function createMockApi() {
  const calls = [];

  const record = (method) => {
    return vi.fn((...args) => {
      calls.push({ method, args });
      // Return a resolved promise by default — tests override with mockResolvedValueOnce
      return Promise.resolve({ data: {}, headers: {} });
    });
  };

  return {
    get: record("get"),
    post: record("post"),
    put: record("put"),
    delete: record("delete"),
    calls,
    getCallsFor: (method) => calls.filter((c) => c.method === method),
    reset: () => {
      calls.length = 0;
    },
  };
}

// --- Utility: reset localStorage mock between tests ---
export function resetLocalStorage() {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  Object.keys(store).forEach((key) => delete store[key]);
}
