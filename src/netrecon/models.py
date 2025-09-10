from dataclasses import dataclass
from typing import Optional

@dataclass
class Device:
    ip: str
    mac: str
    vendor: Optional[str] = None
    hostname: Optional[str] = None
    status: str = "Unknown"
    ports: list = None
    
    def __post_init__(self):
        if self.ports is None:
            self.ports = []
