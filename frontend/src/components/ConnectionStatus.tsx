import { useSocket } from '../hooks/useSocket';

/**
 * Small status badge that reflects the current WebSocket connection state.
 *
 * - Green  "Live"     — WebSocket connected and pushing updates.
 * - Yellow "Polling"  — WebSocket lost; app is falling back to HTTP polling.
 * - Red    "Offline"  — Not connected and no fallback active yet.
 */
export function ConnectionStatus() {
  const { connected, isPollingFallback } = useSocket();

  if (connected && !isPollingFallback) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success border border-success/20">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        Live
      </span>
    );
  }

  if (isPollingFallback) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        Polling
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-danger/10 text-danger border border-danger/20">
      <span className="w-1.5 h-1.5 rounded-full bg-danger" />
      Offline
    </span>
  );
}
