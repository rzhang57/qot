import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5093/hubs/rooms';

class HubClient {
    private connection: signalR.HubConnection;

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
        await this.connection.invoke('JoinRoom', roomCode, username);
    }

    onUserJoined(callback: (username: string, userCount: number) => void) {
        this.connection.on('UserJoined', callback);
    }

    onUserLeft(callback: (username: string) => void) {
        this.connection.on('UserLeft', callback);
    }
}

export const hubClient = new HubClient();