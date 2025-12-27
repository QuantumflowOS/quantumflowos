import { WindowState } from "./types"

export default function Window({
  win,
  focus,
  close,
  children
}: {
  win: WindowState
  focus: () => void
  close: () => void
  children: React.ReactNode
}) {
  if (win.minimized) return null

  return (
    <div
      onMouseDown={focus}
      style={{
        position: "absolute",
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        background: "#050b10",
        border: "1px solid #0ff",
        zIndex: win.z,
        color: "#0ff"
      }}
    >
      <div
        style={{
          background: "#011",
          padding: "4px",
          cursor: "move",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <span>{win.title}</span>
        <button onClick={close}>✕</button>
      </div>
      <div style={{ padding: 8 }}>{children}</div>
    </div>
  )
}
