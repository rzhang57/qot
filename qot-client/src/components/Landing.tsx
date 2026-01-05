import {useEffect, useState} from 'react';
import {type Room, RoomsClient} from "../services/RoomsClient.ts";
import {useNavigate} from "react-router-dom";

const glassBase = "relative backdrop-blur-xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 ease-out";
const glassInactive = "bg-white/30 border-white/40";
const glassIridescent = "bg-gradient-to-r from-rose-300/20 via-fuchsia-300/20 to-indigo-300/20 border-white/50 animate-gradient bg-[length:200%_200%]";

const AmbientBackground = () => (
    <>
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none" />
    </>
);

function Landing() {
    const [view, setView] = useState<'home' | 'join'>('home');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        let showTimer: number | undefined;
        let hideTimer: number | undefined;
        let clearTimer: number | undefined;

        const getEl = () => document.getElementById('landing-error');

        if (error !== '') {
            showTimer = window.setTimeout(() => {
                const node = getEl();
                if (node) {
                    node.classList.remove('opacity-0');
                    node.classList.add('opacity-100');
                }
            }, 10);

            hideTimer = window.setTimeout(() => {
                const node = getEl();
                if (node) {
                    node.classList.remove('opacity-100');
                    node.classList.add('opacity-0');
                }
            }, 4500);

            clearTimer = window.setTimeout(() => {
                setError('');
            }, 5000);
        }

        return () => {
            if (showTimer) window.clearTimeout(showTimer);
            if (hideTimer) window.clearTimeout(hideTimer);
            if (clearTimer) window.clearTimeout(clearTimer);
        };
    }, [error]);


    const handleCreateRoom = async () => {
        try {
            const room: Room = await RoomsClient.createRoom();
            navigate(`/rooms/${room.roomCode}`);
        } catch (error) {
            setError('Something went wrong. Please try again later.');
            console.error('Error creating room:', error);
        }
    };

    const handleJoinRoom = async () => {
        if (roomCode.length === 6) {
            try {
                await RoomsClient.findRoom(roomCode);

                console.log('Room found, navigating to room:', roomCode);
                navigate(`/rooms/${roomCode}`);
            }
            catch (error) {
                setError('Room not found. Check your room code and try again.');
                console.error('Error joining room:', error);
            }
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] overflow-hidden selection:bg-black selection:text-white">
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

            <AmbientBackground />

            <div
                className="z-10 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-700 transition-all duration-500">
                {view === 'join' ? (
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
                                placeholder="Code"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                autoFocus
                            />

                            <button
                                onClick={handleJoinRoom}
                                disabled={roomCode.length !== 6}
                                className={`
                                    flex shrink-0 items-center justify-center w-12 h-12 rounded-full transition-all duration-500 border
                                    ${roomCode.length === 6
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
                            onClick={() => setView('home')}
                        >
                            create a new room instead
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`group ${glassBase} ${glassIridescent} px-16 py-6 rounded-full cursor-pointer hover:scale-102 active:scale-100`}
                            onClick={handleCreateRoom}
                        >
                            <span
                                className="relative z-10 text-xl font-medium tracking-tight text-zinc-700 group-hover:text-zinc-900 transition-colors duration-300">
                                Create a Room
                            </span>
                        </button>

                        <button
                            className="text-zinc-400 text-xs font-medium hover:text-black transition-colors duration-300 cursor-pointer"
                            onClick={() => setView('join')}
                        >
                            or join an existing room
                        </button>

                    </>
                )}
                <div className={`transition-all duration-500 overflow-hidden ${error ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                    <div className="text-red-500 text-xs font-medium">
                        {error}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
export {glassBase, glassInactive, glassIridescent, AmbientBackground};