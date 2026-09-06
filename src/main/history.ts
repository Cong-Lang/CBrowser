import { HistoryChannel } from '../shared/ipc'
import type { History } from '../shared/types/history'
import { getShellWebContents } from './window'

const histories = new Map<string, History>()
let broadcastScheduled = false

export function setLink(link: string, title: string): void {
  const nowTime = Date.now()
  histories.delete(link)
  histories.set(link, {
    time: nowTime,
    title: title
  })
  scheduleBroadcast()
}

export function updateLinkData(link: string, title: string): void {
  const nowTime = Date.now()
  histories.set(link, {
    time: histories.get(link)?.time ?? nowTime,
    title: title
  })
  scheduleBroadcast()
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
