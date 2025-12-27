import { useState } from "react"
import { createWindow } from "./os/kernel"
import Window from "./os/Window"
import AIConsole from "./apps/AIConsole"

export default function OS() {
  const [wins, setWins] = useState([] as any[])

  function open(app: any) {
    setWins(w => [...w, createWindow(app)])
  }

  function focus(id: string) {
    setWins(w =>
      w.map(win =>
        win.id === id ? { ...win, z: Date.now() } : win
      )
    )
  }

  return (
    <>
      {wins.map(win => (
        <Window
          key={win.id}
          win={win}
          focus={() => focus(win.id)}
          close={() => setWins(w => w.filter(x => x.id !== win.id))}
        >
          {win.app === "ai-console" && <AIConsole />}
        </Window>
      ))}

      {/* Taskbar */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#000",
        padding: 6
      }}>
        <button onClick={() => open("ai-console")}>AI</button>
      </div>
    </>
  )
}
