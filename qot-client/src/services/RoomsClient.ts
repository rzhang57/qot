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

async function findRoom(roomCode: string): Promise<Room> {
    const query = roomCode ? `?roomCode=${roomCode}` : '';
    try {
        return await restClient.get<Room>(`/api/rooms${query}`);
    } catch (error) {
        throw new Error('RoomEditor not found');
    }
}

export const RoomsClient = {
    createRoom,
    findRoom
}