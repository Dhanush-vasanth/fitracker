import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";


const Container = styled.div`
width:100%;
height:100vh;
display:flex;
flex-direction:column;
background-color: ${({ theme })=>theme.bg};
color: ${({ theme })=>theme.text_primary};
overflow-x:hidden;
transition: all 0.2s ease;
`

function App() {

  const { currentUser } = useSelector((state) => state.user);

  return (
  <ThemeProvider theme ={lightTheme}>
    <BrowserRouter>
    {currentUser ? (
      <Container>
        <Navbar currentUser={currentUser} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
      </Container>
      ) : (
      <Container>
        <Authentication />
      </Container>
      )}
    </BrowserRouter>
  </ThemeProvider>
  );
}

export default App;
