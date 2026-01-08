import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5093/hubs/rooms';

class HubClient {
    private connection: signalR.HubConnection;
    private currentRoomCode: string | null = null;

    isInRoom(roomCode: string): boolean {
        return this.isConnected() && this.currentRoomCode === roomCode;
    }

    getCurrentRoom(): string | null {
        return this.currentRoomCode;
    }

    isConnected(): boolean {
        return this.connection.state === signalR.HubConnectionState.Connected;
    }

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();
    }

    async start() {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
            await this.connection.start();
        }
    }

    async stop() {
        await this.connection.stop();
    }

    async joinRoom(roomCode: string, username: string) {
        this.currentRoomCode = roomCode;
        await this.connection.invoke('JoinRoom', roomCode, username);
    }

    async sendMarkdownUpdate(roomCode: string, markdownContent: string) {
        await this.connection.invoke('SendMarkdownUpdate', roomCode, markdownContent);
    }

    onUserJoined(callback: (username: string, userCount: number) => void) {
        this.connection.on('UserJoined', callback);
    }

    onUserLeft(callback: (username: string) => void) {
        this.connection.on('UserLeft', callback);
    }

    onMarkdownUpdated(callback: (markdownContent: string) => void) {
        this.connection.on('MarkdownUpdated', callback);
    }
}

export const HubsClient = new HubClient();