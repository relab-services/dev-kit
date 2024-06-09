export type ShutdownHandler = (signal: NodeJS.Signals) => void | Promise<void>
