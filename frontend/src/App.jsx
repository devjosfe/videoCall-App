import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
import Room from "./pages/Room";
function App() {
  return (
    <BrowserRouter>
      <header />

      <SocketProvider>
        <PeerProvider>
          <Routes>
            {/* <Route path="/" element={<h1>hello world</h1>} /> */}
            <Route path="/" element={<Homepage />} />
            <Route path="/room/:roomId" element={<Room />} />
            {/* <Route path="/sign-in" element={SignIn} /> */}

            {/* <Route path="/profile" element={Profile} /> */}
          </Routes>
        </PeerProvider>
      </SocketProvider>
      <footer />
    </BrowserRouter>
  );
}

export default App;
