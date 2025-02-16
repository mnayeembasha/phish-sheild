
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import { EmailSpam } from "./EmailSpam";
import URLInspector from "./URLInspector";
import DeepFakeDetection from "./DeepFakeDetection";
function App() {


  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/url-inspector" element={<URLInspector/>}></Route>
      <Route path="/check-spam-email" element={<EmailSpam/>}></Route>
      <Route path="/deepfake-detection" element={<DeepFakeDetection/>}></Route>
    </Routes>
  </BrowserRouter>);
}

export default App;
