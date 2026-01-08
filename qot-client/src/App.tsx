import {Routes, Route, Navigate} from 'react-router-dom';
import Landing from './components/Landing';
import Room from "./components/Room.tsx";
import RoomEditor from "./components/RoomEditor.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/rooms/:id" element={<Room/>}/>
            <Route path="/rooms/:id/editor" element={<RoomEditor/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
    );
}

export default App;