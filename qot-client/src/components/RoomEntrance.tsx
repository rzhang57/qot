import {AmbientBackground, glassBase, glassInactive, glassIridescent} from "./Landing.tsx";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {hubClient} from "../services/HubClient.ts";

const USERNAME_MINLENGTH = 2;
const USERNAME_MAXLENGTH = 15;

export default function RoomEntrance() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id} = useParams();

    const handleJoinRoom = async () => {
        try {
            await hubClient.start();
            await hubClient.joinRoom(id as string, username);
        } catch (err: any) {
            setError('Failed to join room. Please try again.');
        }
    }

    return (
        <div
            className="relative flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] overflow-hidden selection:bg-black selection:text-white gap-2">
            <style>{`
                @keyframes gradient-move {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient-move 8s ease infinite;
                }
            `}</style>

            <AmbientBackground/>

            <div className={"text-zinc-400 text-medium tracking-tighter"}>
                Room <span className={"font-semibold"}>{id}</span>
            </div>
            <div
                className="z-10 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-700 transition-all duration-500">
                <>
                    <div
                        className={`
                            ${glassBase}
                            ${glassInactive}
                            rounded-full w-70 flex items-center p-3 pl-8
                            focus-within:scale-102
                        `}
                    >
                        <input
                            type="text"
                            className="flex-1 min-w-0 bg-transparent font-semibold text-center text-2xl text-zinc-800 placeholder:text-zinc-300 outline-none border-none tracking-tight"
                            placeholder="nickname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            maxLength={USERNAME_MAXLENGTH}
                            autoFocus
                        />

                        <button
                            onClick={handleJoinRoom}
                            disabled={username.length <= USERNAME_MINLENGTH}
                            className={`
                                flex shrink-0 items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border
                                ${username.length >= USERNAME_MINLENGTH
                                ? `${glassIridescent} text-zinc-800 scale-102 rotate-0 shadow-sm cursor-pointer`
                                : 'bg-zinc-100/50 border-transparent text-zinc-300 scale-90 cursor-not-allowed'}
                            `}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                    <button
                        className="text-zinc-400 text-xs font-medium hover:text-black transition-colors duration-300 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        go back
                    </button>
                </>
                <div
                    className={`transition-all duration-500 overflow-hidden ${error ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                    <div className="text-red-500 text-xs font-medium">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    );
}