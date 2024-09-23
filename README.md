# WebSocket Proxy Server for Maverick Betting Bot

This proxy server facilitates communication between Maverick and a WebSocket server. It is particularly useful when the server is managed externally (e.g., Laravel/Pusher) and requires intermediary translation or message handling.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/t00ts/maverick-proxy.git
   cd maverick-proxy/
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

## Configuration

1. Update `SERVER_URL`:

Open the `main.js` file and replace `ws://server_address:port` with the actual WebSocket server URL:

```javascript
const SERVER_URL = 'ws://your_server_address:your_server_port';
```

2. Set Proxy Server Port (Optional):

If you wish to use a different port for the proxy server, update the PROXY_PORT constant:

```javascript
const PROXY_PORT = 8080; // Replace with your desired port number
```

3. Configure Maverick to use the proxy server:

Point Maverick to the proxy server instead of the original server:

```toml
[server]
addr = "ws://localhost:8080"
```

Replace `localhost` and `8080` with the appropriate host and port if you have configured them differently.

## Usage

1. Run the Proxy Server:

```bash
node main.js
```
