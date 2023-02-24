import  client  from "socket.io-client";
import { url } from "../const/urls";

export function useSocket () {
    const socket = client(url);
    return {
        socket
    }
}