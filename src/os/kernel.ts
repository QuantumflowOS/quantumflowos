import { WindowState, AppID } from "./types"

let zCounter = 1

export function createWindow(app: AppID): WindowState {
  return {
    id: crypto.randomUUID(),
    app,
    title: app.toUpperCase(),
    x: 120,
    y: 120,
    width: 420,
    height: 300,
    minimized: false,
    z: zCounter++
  }
}
