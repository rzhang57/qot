import {restClient} from "./RestClient.ts";

export interface Room {
    roomCode: string;
}

export class RoomsClient {
    static async createRoom(): Promise<{ roomCode: string }> {
        return await restClient.post<{ roomCode: string }>('/rooms');
    }
}