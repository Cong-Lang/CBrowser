import { HistoryChannel } from '../shared/ipc'
import type { History } from '../shared/types/history'
import { getStore, setStore } from './store'
import { getShellWebContents } from './window'

let histories = new Map<string, History>()
let broadcastScheduled = false

export function setLink(link: string, title: string): void {
  const nowTime = Date.now()
  histories.delete(link)
  histories.set(link, {
    time: nowTime,
    title: title
  })
  scheduleBroadcast()
  saveHistory()
}

export function updateLinkData(link: string, title: string): void {
  const nowTime = Date.now()
  histories.set(link, {
    time: histories.get(link)?.time ?? nowTime,
    title: title
  })
  scheduleBroadcast()
  saveHistory()
}

export function getHistorise(offset?: number, count?: number): [string, History][] {
  if (offset != undefined && count != undefined) {
    const offsetHistorise = Array.from(histories.entries())
      .reverse()
      .slice(offset, offset + count)
    return offsetHistorise
  }
  return Array.from(histories.entries()).reverse()
}

export function generateTestHistory(): void {
  for (let i = 0; i < 800; i++) {
    histories.set(`test-${i}`, {
      time: 0,
      title: `title-${i}`
    })
  }
}

function scheduleBroadcast(): void {
  if (broadcastScheduled) return
  broadcastScheduled = true
  const contents = getShellWebContents()
  if (!contents) return
  contents.send(HistoryChannel.State, getHistorise(0, 200))
  broadcastScheduled = false
}

export function saveHistory(): void {
  setStore('history', Array.from(histories.entries()))
}

export function readHistory(): void {
  const localHistory = getStore('history')
  if (isHistoryArray(localHistory)) {
    histories = new Map(localHistory)
  }
}

function isHistoryArray(value: unknown): value is [string, History][] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      Array.isArray(item) &&
      item.length === 2 &&
      typeof item[0] === 'string' &&
      typeof item[1] === 'object' &&
      item[1] !== null
  )
}
