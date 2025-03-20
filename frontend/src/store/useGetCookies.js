import { create } from 'zustand';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

const BaseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";


export const useGetCookies = create((set, get) => {
    const authUser = Cookies.get("userLoggedIn") || null;

    // Initialize socket connection if user is logged in
    const socket = authUser
        ? io(BaseURL, {
            query: { userId: authUser }
        })
        : null;

    return {
        authUser,
        socket,
        updateAuthUser: (userId) => {
            // Cookies.set("userLoggedIn", userId);
            set({ authUser: userId });
            get().connectSocket();
        },
        logoutUser: () => {
            Cookies.remove("userLoggedIn");
            set({ authUser: null });
            get().disconnectSocket();
        },
        connectSocket:() => {
            const { authUser, socket } = get();
            if (!authUser || socket?.connected) return;

            const newSocket = io(BaseURL, {
                query: { userId: authUser }
            });
            newSocket.connect();
            set({ socket: newSocket });
        },
        disconnectSocket:() => {
            if (get().socket?.connected) {
                get().socket.disconnect();
                set({ socket: null });
            }
        },
    };
});
