// Global type declarations for CivicSensor
export {};

declare global {
  // Interval handle used for background work-order polling
  var __civic_workorder_poller: ReturnType<typeof setInterval> | null;
}
