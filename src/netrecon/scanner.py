from scapy.all import ARP, Ether, ICMP, IP, srp, sr1, conf
from scapy.layers.l2 import getmacbyip
import socket
from .models import Device
import netifaces

class NetworkScanner:
    def __init__(self, interface: str = None):
        self.interface = interface or conf.iface
        self.discovered_devices = []
    
    def get_network_info(self):
        """Get network address and netmask for the interface"""
        try:
            addresses = netifaces.ifaddresses(self.interface)
            ip_info = addresses[netifaces.AF_INET][0]
            return ip_info['addr'], ip_info['netmask']
        except:
            raise Exception(f"Could not get network info for interface {self.interface}")
    
    def calculate_network_range(self, ip: str, netmask: str):
        """Calculate all IPs in network range"""
        ip_parts = list(map(int, ip.split('.')))
        mask_parts = list(map(int, netmask.split('.')))
        
        network_addr = [ip_parts[i] & mask_parts[i] for i in range(4)]
        broadcast = [network_addr[i] | (~mask_parts[i] & 0xff) for i in range(4)]
        
        return network_addr, broadcast
    
    def arp_scan(self, timeout: int = 2):
        """Perform ARP scan for local network"""
        ip, netmask = self.get_network_info()
        network_addr, broadcast = self.calculate_network_range(ip, netmask)
        
        # Create ARP packet
        arp_request = ARP(pdst=f"{network_addr[0]}.{network_addr[1]}.{network_addr[2]}.1/24")
        broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
        arp_request_broadcast = broadcast / arp_request
        
        # Send packets and get responses
        answered_list = srp(arp_request_broadcast, timeout=timeout, 
                           iface=self.interface, verbose=False)[0]
        
        devices = []
        for sent, received in answered_list:
            devices.append(Device(
                ip=received.psrc,
                mac=received.hwsrc,
                vendor=self.get_vendor_from_mac(received.hwsrc),
                status="Active"
            ))
        
        return devices
    
    def ping_sweep(self, timeout: int = 1):
        """Perform ICMP ping sweep"""
        ip, netmask = self.get_network_info()
        network_addr, broadcast = self.calculate_network_range(ip, netmask)
        
        devices = []
        base_ip = f"{network_addr[0]}.{network_addr[1]}.{network_addr[2]}"
        
        for i in range(1, 255):  # Scan .1 to .254
            target_ip = f"{base_ip}.{i}"
            packet = IP(dst=target_ip)/ICMP()
            response = sr1(packet, timeout=timeout, verbose=False)
            
            if response:
                try:
                    mac = getmacbyip(target_ip)
                    devices.append(Device(
                        ip=target_ip,
                        mac=mac or "Unknown",
                        vendor=self.get_vendor_from_mac(mac) if mac else "Unknown",
                        status="Active",
                    ))
                except:
                    devices.append(Device(
                        ip=target_ip,
                        mac="Unknown",
                        status="Active"
                    ))
        
        return devices
    
    def get_vendor_from_mac(self, mac: str) -> str:
        """Try to get vendor from MAC address (simplified)"""
        # In real implementation, use a proper OUI database
        vendors = {
            "00:50:56": "VMware",
            "00:0c:29": "VMware",
            "00:1c:42": "Parallels",
            "00:03:ff": "Microsoft",
            "00:1a:4b": "Apple",
            "00:24:36": "Cisco",
            "00:15:5d": "Microsoft Hyper-V"
        }
        
        if mac:
            mac_prefix = mac.lower()[:8]
            return vendors.get(mac_prefix, "Unknown Vendor")
        return "Unknown"
    
    def get_hostname(self, ip: str) -> str:
        """Try to resolve IP to hostname"""
        try:
            return socket.gethostbyaddr(ip)[0]
        except:
            return "Unknown"
