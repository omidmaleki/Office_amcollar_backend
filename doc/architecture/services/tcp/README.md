[← Back to Overview](../../overview.md)

# TCP Service Documentation

## Overview
The TCP Service acts as the raw connection handler for smart collar hardware. Many IoT devices communicate via persistent TCP sockets rather than HTTP. This service bridges that gap.

## Key Responsibilities
- **Connection Management**: Maintains persistent TCP connections with thousands of devices.
- **Protocol Decoding**: Parses proprietary binary protocols from hardware into JSON/structured format.
- **Authentication**: Validates device identity (often via handshake).
- **Forwarding**: Publishes decoded messages to **Kafka** for the `Process Service` to handle.

## Architecture
- **Inbound**: Raw TCP on specific ports (e.g., 9000).
- **Outbound**: Kafka Producer.

## Why Separate?
- **Scalability**: TCP handling (long-lived connections) has different resource profiles than HTTP web servers.
- **Isolation**: Crashes in protocol parsing don't affect the web API.
