import { io } from "socket.io-client";
import { API_HOST_ADDRESS } from "@/config/env";

// Make sure API_HOST_ADDRESS includes the protocol (http:// or https://)
console.log(API_HOST_ADDRESS);
const SOCKET_URL = API_HOST_ADDRESS.startsWith("http")
  ? API_HOST_ADDRESS
  : `https://${API_HOST_ADDRESS}`;

console.log("Connecting to socket URL:", SOCKET_URL);

// Create the socket instance
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

// Socket service for more controlled management
export const socketService = {
  connect: (userId: string, role: string) => {
    // Make sure we're not already connected
    if (socket.connected) {
      console.log("Socket already connected, identifying user");
      socket.emit("identify", { userId, role });
      return;
    }

    // Set up connection event
    socket.on("connect", () => {
      console.log(`Connected with socket ID: ${socket.id}`);
      localStorage.setItem("socketId", socket.id);

      // Identify the user to the server
      socket.emit("identify", { userId, role });
    });

    // Set up error handling
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Connect if not auto-connecting
    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnect: () => {
    socket.off("connect");
    socket.off("connect_error");
    socket.disconnect();
    localStorage.removeItem("socketId");
    console.log("Socket disconnected");
  },
};
