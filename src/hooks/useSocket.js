import  client  from "socket.io-client";
import { url } from "../const/urls";

const socket = client(url);

export function useSocket () {
    
    return {
        socket
    }
}