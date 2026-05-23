import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Device {
  id: string
  name: string
  deviceKey: string
  type: 'light' | 'curtain' | 'temperature_sensor'
  status: 'online' | 'offline'
  roomId: string | null
  roomName?: string
  lastSeenAt: string | null
  createdAt: string
  // 最新状态（device_latest_state.state jsonb）
  latestState: Record<string, unknown>
}

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>([])
  const wsConnected = ref(false)
  let ws: WebSocket | null = null

  const onlineCount = computed(() => devices.value.filter(d => d.status === 'online').length)
  const offlineCount = computed(() => devices.value.filter(d => d.status === 'offline').length)

  function connectWebSocket() {
    const token = localStorage.getItem('token')
    if (!token) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}`

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      wsConnected.value = true
    }

    ws.onclose = () => {
      wsConnected.value = false
      // 断线 5 秒后重连
      setTimeout(connectWebSocket, 5000)
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      handleWsMessage(msg)
    }
  }

  function handleWsMessage(msg: { type: string; deviceKey: string; data: any; ts: number }) {
    const device = devices.value.find(d => d.deviceKey === msg.deviceKey)
    if (!device) return

    switch (msg.type) {
      case 'telemetry':
      case 'status':
        device.latestState = { ...device.latestState, ...msg.data }
        break
      case 'device_online':
        device.status = 'online'
        break
      case 'device_offline':
        device.status = 'offline'
        break
      case 'command':
        // 命令执行结果，由控制面板处理
        break
    }
  }

  function disconnectWebSocket() {
    ws?.close()
    ws = null
  }

  return {
    devices,
    wsConnected,
    onlineCount,
    offlineCount,
    connectWebSocket,
    disconnectWebSocket
  }
})
