// Jitsi's public instance (meet.jit.si) supports direct iframe embeds with
// no signup, API key, or extra script — config params below skip the
// pre-join lobby screen and hide branding chrome so it drops straight into
// the call.
export default function LiveVideoRoom({ roomName, displayName, onClose }) {
  const params = new URLSearchParams({
    "config.prejoinPageEnabled": "false",
    "config.disableDeepLinking": "true",
    "userInfo.displayName": displayName || "",
    "interfaceConfig.SHOW_JITSI_WATERMARK": "false",
  });
  const src = `https://meet.jit.si/${encodeURIComponent(roomName)}#${params.toString()}`;

  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 bg-ink text-paper shrink-0">
        <p className="text-sm font-medium">Live class</p>
        {onClose && (
          <button onClick={onClose} className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 transition-colors">
            Leave call
          </button>
        )}
      </div>
      <iframe
        src={src}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full border-0"
        title="Live video lesson"
      />
    </div>
  );
}
