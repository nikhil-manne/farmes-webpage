import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileShell } from "@/components/layout/MobileShell";
import Home from "./pages/Home";
import Product from "./pages/Product";
import FarmerProfile from "./pages/FarmerProfile";
import Farmers from "./pages/Farmers";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import LaunchBanner from "./components/LaunchBanner";
import Market from "./pages/Market";
import Gallery from "./pages/Gallery";
import AboutUs from "./pages/AboutUs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound.tsx";
import { FarmerInterestPopup } from "./components/FarmerInterestPopup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LaunchBanner />
      <FarmerInterestPopup />
      <BrowserRouter>
        <MobileShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market" element={<Market />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/farmer/:id" element={<FarmerProfile />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
