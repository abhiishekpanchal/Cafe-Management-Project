import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CafeRegistrationForm from './pages/CafeRegistrationForm';
import MenuUpload from './pages/MenuUpload';
import CafeLoginForm from './pages/CafeLoginForm';
import OrderUser from './pages/OrderUser';
import GetQR from './pages/GetQR';
import OrderPanelAdmin from './pages/OrderPanelAdmin';
import CartPage from './pages/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* CAFE REGISTRATION */}
        <Route path="/register" element={<CafeRegistrationForm />} />
        <Route path="/" element={<CafeLoginForm />} />
        <Route path="/menu/:cafeId" element={<MenuUpload />} />
        <Route path="/menu/:cafeId/getQR" element={<GetQR />} />

        {/* ORDER BY USER */}
        <Route path="/order/:cafeId/:tableId" element={<OrderUser />} />
        <Route path="/order/cart/:cafeId/:tableId" element={<CartPage />} />

        {/* ORDER PANEL ADMIN */}
        <Route path="/admin/:cafeId" element={<OrderPanelAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
