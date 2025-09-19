import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Book = lazy(() => import("./pages/Book"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/book" element={<Book />} />
      <Route path="/book/:id" element={<Book />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
