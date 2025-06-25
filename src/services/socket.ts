// Socket functionality disabled - using polling instead
export const socket = null;

export const socketService = {
  connect: (user_id: any, role: any) => {
    console.log(
      "Socket service disabled - using polling for real-time updates"
    );
  },
  disconnect: () => {
    console.log("Socket service disabled");
  },
};
