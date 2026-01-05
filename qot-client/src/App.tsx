import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import RoomEntrance from "./components/RoomEntrance.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/rooms/:id" element={<RoomEntrance />} />
        </Routes>
    );
}

export default App;