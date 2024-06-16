export const levels = {
    error: 10,
    warn: 20,
    info: 30,
    debug: 40,
    trace: 50,
} as const

export type LayoutElement = 'timestamp' | 'level' | 'area' | 'message' | 'details' | 'error'

export type Configuration = {
    layout: Record<LayoutElement, boolean>
    verbosity: Record<string, keyof typeof levels>
    telegram:
        | { enabled: false }
        | {
              enabled: true
              token: string
              chatId: number
          }
}
