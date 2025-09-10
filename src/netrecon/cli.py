#!/usr/bin/env python3
import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from .scanner import NetworkScanner
import netifaces

console = Console()

@click.command()
@click.option('--interface', '-i', help='Network interface to use')
@click.option('--scan-type', '-t', type=click.Choice(['arp', 'ping', 'both']), 
              default='arp', help='Scan type: arp, ping, or both')
@click.option('--timeout', '-to', default=2, help='Timeout for each request')
def main(interface, scan_type, timeout):
    """NetRecon - Network Device Discovery Scanner"""
    
    if not interface:
        # Show available interfaces
        interfaces = netifaces.interfaces()
        console.print("\n[bold]Available Interfaces:[/bold]")
        for i, iface in enumerate(interfaces):
            console.print(f"{i+1}. {iface}")
        
        choice = click.prompt("\nSelect interface (number)", type=int)
        interface = interfaces[choice-1]
    
    console.print(f"\n[bold green]Starting scan on {interface}...[/bold green]")
    
    scanner = NetworkScanner(interface)
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Scanning network...", total=None)
        
        devices = []
        if scan_type in ['arp', 'both']:
            devices.extend(scanner.arp_scan(timeout))
        if scan_type in ['ping', 'both']:
            devices.extend(scanner.ping_sweep(timeout))
        
        progress.update(task, completed=True)
    
    # Remove duplicates
    unique_devices = {}
    for device in devices:
        if device.ip not in unique_devices:
            unique_devices[device.ip] = device
    
    # Display results
    display_results(list(unique_devices.values()))

def display_results(devices):
    """Display results in a beautiful table"""
    table = Table(title="Discovered Devices", show_header=True, header_style="bold magenta")
    
    table.add_column("IP Address", style="cyan")
    table.add_column("MAC Address", style="green")
    table.add_column("Vendor", style="yellow")
    table.add_column("Status", style="red")
    table.add_column("Hostname", style="blue")
    
    for device in devices:
        hostname = device.hostname or "Unknown"
        table.add_row(
            device.ip,
            device.mac,
            device.vendor or "Unknown",
            device.status,
            hostname
        )
    
    console.print(table)
    console.print(f"\n[bold]Found {len(devices)} devices[/bold]")

if __name__ == "__main__":
    main()
