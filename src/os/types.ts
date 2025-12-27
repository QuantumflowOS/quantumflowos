export type AppID =
  | "bios"
  | "chronos"
  | "sonic"
  | "ai-console"

export interface WindowState {
  id: string
  app: AppID
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  z: number
}
