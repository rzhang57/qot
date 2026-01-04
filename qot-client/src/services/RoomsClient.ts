import {restClient} from "./RestClient.ts";

export interface Room {
    roomCode: string;
    users: User[];
    markdownContent: string;
    createdAt: string;
    maxCapacity: number;
}

export interface User {
    alias: string;
    connectionId: string;
}

async function createRoom(): Promise<Room> {
    return await restClient.post<Room>('/api/rooms');
}

export const RoomsClient = {
    createRoom
}