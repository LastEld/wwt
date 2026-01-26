import { NextApiRequest, NextApiResponse } from "next";
import { RealtimeGateway } from "../../../services/realtime/realtime-gateway";
import { Server as NetServer } from "http";

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = async (req: NextApiRequest, res: any) => {
    if (!res.socket.server.io) {
        console.log("Initializing Socket.io server (Pages Router Bridge)...");
        const httpServer: NetServer = res.socket.server as any;
        const io = await RealtimeGateway.init(httpServer);
        res.socket.server.io = io;
    } else {
        console.log("Socket.io server already running");
    }
    res.end();
};

export default ioHandler;
