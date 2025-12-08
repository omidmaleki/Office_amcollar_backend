import socket
import json

tcp_ip = "127.0.0.1"
tcp_port = 9011

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((tcp_ip, tcp_port))

data = {
    "ACCx": 1.43,
    "ACCy": 4.56,
    "ACCz": 7.89,
    "Gx": 0.12,
    "Gy": 0.34,
    "Gz": 0.56
}

s.send(json.dumps(data).encode())
s.close()
print("Sent test data!")