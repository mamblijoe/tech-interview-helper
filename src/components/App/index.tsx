import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "../Layout";
import Questions from "../Questions";
import Presets from "../Presets";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={"/"} element={<div>Home</div>} />
          <Route path={"/questions"} element={<Questions />} />
          <Route path={"/presets"} element={<Presets />} />
          <Route path={"*"} element={<div>404</div>} />
        </Route>
      </Routes>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>;
    </BrowserRouter>
  );
};

export default App;
