export interface History {
  time: number
  title: string
}

export type HistoryState = [string, History][]
