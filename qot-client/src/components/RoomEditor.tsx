import {hubClient} from "../services/HubClient.ts";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function RoomEditor() {
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        if (!hubClient.isInRoom(id as string)) {
            navigate(`/rooms/${id}`);
        }
    }, [id]);

    return (
        <div>Room Editor Component</div>
    );
}