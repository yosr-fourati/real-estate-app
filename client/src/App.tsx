// client/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import RequireAdmin from "./components/RequireAdmin";
import AdminAdd from "./pages/admin/AdminAdd";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/admin" element={<AdminHome />} />
<Route
  path="/admin/add"
  element={
    <RequireAdmin>
      <AdminAdd />
    </RequireAdmin>
  }
/>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertyListPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminHome />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

