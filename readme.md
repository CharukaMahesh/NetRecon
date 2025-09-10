# NetRecon

A powerful Python network discovery scanner designed for ethical hackers and network administrators. NetRecon helps you quickly identify all devices connected to your network with detailed information presented in a clean, professional table format.

![Network Scanner](https://img.shields.io/badge/Network-Scanner-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Kali-brightgreen)

## ⚠️ Legal Disclaimer

**NetRecon is designed for authorized security testing and educational purposes only.**

- You must only use this tool on networks you own or have explicit, written permission to test
- Unauthorized network scanning may be illegal in your jurisdiction
- The developers are not responsible for any misuse or damage caused by this tool
- Always ensure compliance with local laws and regulations

## ✨ Features

- **Multiple Scan Techniques**: ARP scanning (fast) and ICMP ping sweeping
- **Beautiful Interface**: Rich, colorful table output with professional formatting
- **Device Fingerprinting**: MAC address vendor detection and hostname resolution
- **Interactive Interface Selection**: Choose from available network interfaces
- **Real-time Progress**: Visual progress indicators during scanning
- **Comprehensive Results**: IP addresses, MAC addresses, vendors, status, and hostnames
- **Kali Linux Optimized**: Works perfectly on security distributions

## 🚀 Installation

### Prerequisites
- **Python 3.8 or higher**
- **Linux/Kali Linux** (Recommended)
- **Root privileges** for packet capture

### Kali Linux Installation

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
git clone https://github.com/yourusername/netrecon.git
cd netrecon
poetry install
pip install .
```
### Alternative Installation Methods

# Using pip directly:
```bash
pip install git+https://github.com/yourusername/netrecon.git
