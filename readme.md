# NetRecon

<p>A powerful Python network discovery scanner designed for ethical hackers and network administrators. NetRecon helps you quickly identify all devices connected to your network with detailed information presented in a clean, professional table format.</p>

<img src="https://img.shields.io/badge/Network-Scanner-blue">
<img src="https://img.shields.io/badge/Python-3.8%252B-green">
<img src="https://img.shields.io/badge/License-MIT-yellow">
<imhg src="https://img.shields.io/badge/Platform-Linux%2520%257C%2520Kali-brightgreen">

⚠️ Legal Disclaimer
NetRecon is designed for authorized security testing and educational purposes only.

> You must only use this tool on networks you own or have explicit, written permission to test

> Unauthorized network scanning may be illegal in your jurisdiction

> The developers are not responsible for any misuse or damage caused by this tool

> Always ensure compliance with local laws and regulations

✨ Features
Multiple Scan Techniques: ARP scanning (fast) and ICMP ping sweeping

> Beautiful Interface: Rich, colorful table output with professional formatting

> Device Fingerprinting: MAC address vendor detection and hostname resolution

> Interactive Interface Selection: Choose from available network interfaces

> Real-time Progress: Visual progress indicators during scanning

> Comprehensive Results: IP addresses, MAC addresses, vendors, status, and hostnames

> Kali Linux Optimized: Works perfectly on security distributions

# 🚀 Installation

### Prerequisites
- **Python 3.8 or higher**
- **Linux/Kali Linux** (Recommended)
- **Root privileges** for packet capture

### Kali Linux Installation

# Update system packages
sudo apt update

# Install Python and tools
sudo apt install python3 python3-pip python3-venv

# Clone the repository
git clone https://github.com/yourusername/netrecon.git
cd netrecon

# Install with Poetry (recommended)
poetry install

# Alternative: install with pip
pip install .

Alternative Installation Methods
Using pip directly:
pip install git+https://github.com/yourusername/netrecon.git
Manual installation:

bash
git clone https://github.com/yourusername/netrecon.git
cd netrecon
python setup.py install
📖 Usage
Basic Commands
bash
# Simple scan (interactive interface selection)
sudo netrecon

# Scan specific interface
sudo netrecon -i eth0

# Use ARP scan (fast, recommended for local networks)
sudo netrecon -i wlan0 -t arp

# Use both ARP and Ping scanning
sudo netrecon -i eth0 -t both

# Set custom timeout
sudo netrecon -i eth0 -to 3
Command Line Options
text
Options:
  -i, --interface TEXT    Network interface to use
  -t, --scan-type [arp|ping|both]
                          Scan type: arp, ping, or both
  -to, --timeout INTEGER  Timeout for each request (seconds)
  --help                  Show this message and exit
Example Output
text
Discovered Devices
┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━┓
┃ IP Address   ┃ MAC Address               ┃ Vendor          ┃ Status ┃ Hostname       ┃
┡━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━┩
│ 192.168.1.1  │ aa:bb:cc:dd:ee:ff         │ Cisco Systems   │ Active │ router.local   │
│ 192.168.1.15 │ 11:22:33:44:55:66         │ Apple           │ Active │ macbook-pro    │
│ 192.168.1.23 │ ff:ee:dd:cc:bb:aa         │ Unknown Vendor  │ Active │ Unknown        │
│ 192.168.1.42 │ 12:34:56:78:90:ab         │ Samsung         │ Active │ galaxy-phone   │
└──────────────┴───────────────────────────┴─────────────────┴────────┴────────────────┘

Found 4 devices
🛠️ How It Works
ARP Scanning
Sends ARP requests to all IPs in the local subnet

Listens for ARP responses to identify active devices

Very fast and efficient for local network discovery

ICMP Ping Sweep
Sends ICMP echo requests to target IPs

Useful for detecting devices that don't respond to ARP

Can identify devices across different subnets

Vendor Identification
Uses MAC address OUI lookup for device identification

Matches first 6 characters of MAC to vendor database

Helps identify device types and manufacturers

🔍 Common Use Cases
Network Inventory: Discover all connected devices

Security Audits: Identify unauthorized devices

Troubleshooting: Find connectivity issues

Penetration Testing: Network reconnaissance phase

Educational Purposes: Learn networking concepts

❓ Troubleshooting
Permission Errors
bash
# Use sudo for packet capture capabilities
sudo netrecon -i eth0
Interface Not Found
bash
# List available interfaces
ip link show
# or
ifconfig -a

# Use correct interface name
sudo netrecon -i wlan0
No Devices Found
Verify network connectivity

Check interface selection

Try different scan types

Adjust timeout values
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

Development Guidelines
Follow PEP 8 style guide

Write tests for new features

Update documentation accordingly

Use descriptive commit messages

📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Built with Scapy for packet manipulation

Beautiful output powered by Rich

Command-line interface with Click

Inspired by network security tools community

📞 Support
If you need help:

Check the troubleshooting section above

Search existing issues

Create a new issue with detailed information

Join our Discussions

🚨 Responsible Usage
Always obtain proper authorization before scanning

Respect network privacy and security

Use only for legitimate security testing

Educate others about responsible hacking practices

Remember: With great power comes great responsibility. Always scan ethically!
