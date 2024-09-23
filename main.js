/**
 * WebSocket Proxy Server for Maverick Betting Bot
 *
 * This proxy server facilitates communication between Maverick and a WebSocket server
 *
 * This proxy is particularly useful for users who need additional translation or message handling when
 * interfacing with WebSocket servers they don't have full control over. By acting as an intermediary,
 * it allows for message manipulation, logging, or protocol translation as needed.
 *
 * @module MaverickProxyServer
 * @requires ws
 * @version 1.0.0
 * @license MIT
 * @author
 */

const WebSocket = require('ws');

// The port the proxy server will listen on
const PROXY_PORT = 8080;

// The main server URL and port
const SERVER_URL = "ws://server_address:port";

// The message to send to the server upon connection
const MESSAGE_TO_SEND_ON_CONNECT = { 
    "event":"pusher:subscribe", 
    "data": { "channel": "{{CHANNEL NAME}}" }
}

// Create a WebSocket proxy server
const wss = new WebSocket.Server({ port: PROXY_PORT }, () => {
    console.log(`Maverick proxy server is listening on port ${PROXY_PORT}`);
});

// Handle incoming Maverick connections
wss.on('connection', (mavckSocket) => {
    console.log('Maverick connected');

    // Establish a connection to the server
    const serverSocket = new WebSocket(SERVER_URL);

    // Handle server connection open event
    serverSocket.on('open', () => {
        console.log('Connected to server');

        // Send a custom message to the server upon successful connection
        serverSocket.send(JSON.stringify(MESSAGE_TO_SEND_ON_CONNECT));

        // Forward messages from Maverick to the server
        mavckSocket.on('message', (message, isBinary) => {
            if (serverSocket.readyState === WebSocket.OPEN) {
                const textMessage = isBinary ? message.toString() : message;
                serverSocket.send(textMessage, { binary: false });
                console.log('Forwarded message to server:', message.toString());
            }
        });
    
        // Forward messages from the server to Maverick
        serverSocket.on('message', (message, isBinary) => {
            if (mavckSocket.readyState === WebSocket.OPEN) {
                const textMessage = isBinary ? message.toString() : message;
                mavckSocket.send(textMessage, { binary: false });
                console.log('Forwarded message to Maverick:', message.toString());
            }
        });
    
        // Handle Maverick disconnection
        mavckSocket.on('close', () => {
            console.log('Maverick disconnected');
            if (serverSocket.readyState === WebSocket.OPEN || serverSocket.readyState === WebSocket.CONNECTING) {
                serverSocket.close();
            }
        });

        // Handle server disconnection
        serverSocket.on('close', () => {
            console.log('Server disconnected');
            if (mavckSocket.readyState === WebSocket.OPEN || mavckSocket.readyState === WebSocket.CONNECTING) {
                mavckSocket.close();
            }
        });

        // Handle Maverick errors
        mavckSocket.on('error', (err) => {
            console.error('Maverick socket error:', err);
            if (serverSocket.readyState === WebSocket.OPEN || serverSocket.readyState === WebSocket.CONNECTING) {
                serverSocket.close();
            }
        });

        // Handle server errors
        serverSocket.on('error', (err) => {
            console.error('Server socket error:', err);
            if (mavckSocket.readyState === WebSocket.OPEN || mavckSocket.readyState === WebSocket.CONNECTING) {
                mavckSocket.close();
            }
        });
    });

    // Handle errors during connection to the server
    serverSocket.on('error', (err) => {
        console.error('Failed to connect to server:', err);
        if (mavckSocket.readyState === WebSocket.OPEN || mavckSocket.readyState === WebSocket.CONNECTING) {
            mavckSocket.close();
        }
    });

});
