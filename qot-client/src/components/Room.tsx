import {useEffect, useState} from "react";
import RoomEntrance from "./RoomEntrance.tsx";
import {useNavigate, useParams} from "react-router-dom";

export default function Room() {
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();
    const { id} = useParams();

    useEffect(() => {
        if (isConnected) {
            navigate(`/rooms/${id}/editor`);
        }
    }, [isConnected]);

    return (<RoomEntrance setIsConnected={setIsConnected} />);
}