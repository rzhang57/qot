import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Room from "./components/Room.tsx";
import RoomEditor from "./components/RoomEditor.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/rooms/:id" element={<Room />} />
            <Route path="/rooms/:id/editor" element={<RoomEditor />} />
        </Routes>
    );
}

export default App;