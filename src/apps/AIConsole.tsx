import { useState } from "react"

export default function AIConsole() {
  const [input, setInput] = useState("")
  const [out, setOut] = useState("")

  async function send() {
    const r = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    })
    const j = await r.json()
    setOut(j.candidates?.[0]?.content?.parts?.[0]?.text || "No response")
  }

  return (
    <>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        style={{ width: "100%", height: 80 }}
      />
      <button onClick={send}>Execute</button>
      <pre>{out}</pre>
    </>
  )
}
