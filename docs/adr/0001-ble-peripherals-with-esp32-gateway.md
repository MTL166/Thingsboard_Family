# 使用 BLE 外设 + ESP32 网关架构，而非每设备直连 WiFi

原设计文档中每个设备（灯、窗帘、温度）各自连接一块 ESP32 并独立通过 WiFi 上报。实际采用两块 ESP32 协同：一块作为 BLE Central 网关统一连接 WiFi + MQTT，另一块作为 BLE Peripheral 外设同时接灯（PWM）、窗帘电机和 DS18B20 温度传感器，三合一固件通过蓝牙与网关通信。

**理由**：只用两块 ESP32 跑完全系统，硬件最少。一块外设的 GPIO 足够接三种外设（灯用 2 引脚、窗帘用 3 引脚、DS18B20 用 1 引脚）。更接近真实智能家居拓扑——传感器/执行器走 BLE 汇聚到一个网关，网关负责与云端通信。

**Considered options**：
- **每设备各一块 ESP32 直连 WiFi**：物理上清晰但多块各自连 WiFi 增加网络复杂度，不反映真实架构
- **四块 ESP32（1 网关 + 3 外设）**：每外设独立，但硬件多了
- **两块 ESP32（1 网关 + 1 三合一股外设）**（选定）：最省硬件，一块外设 ESP32 同时驱动灯/窗帘/DS18B20

**BLE 角色分配**：
| 角色 | 硬件 | BLE 模式 | 固件职责 |
|------|------|----------|----------|
| 网关 | ESP32 #1 | Central | 扫描/连接、GATT 读写、WiFi + MQTT |
| 三合一股外设 | ESP32 #2 | Peripheral (GATT Server) | 灯 PWM + 窗帘电机 + DS18B20，一组 GATT Service 暴露三组 Characteristic |

**GATT Characteristic 设计**（同一 Service，按 device_key 分区）：
| Characteristic | 对应 device_key | 方向 |
|------|------|------|
| Light Status | `light_001` | Notify（外设→网关） |
| Light Command | `light_001` | Write（网关→外设） |
| Curtain Status | `curtain_001` | Notify |
| Curtain Command | `curtain_001` | Write |
| Temperature | `temp_001` | Notify |

系统逻辑上依然是三个 device_key、三个 Device，不因物理合并而改变。

**Consequences**：
- 网关离线 = 三个设备同时变 offline（不区分"网关离线"和"设备离线"）
- 命令和遥测经过 BLE + WiFi 双跳，延迟略高但 5 秒超时窗口仍有余量
- 外设端固件三合一，代码量比三个独立外设大，但 GPIO 和 GATT 管理可模块化

