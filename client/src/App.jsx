import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CafeRegistrationForm from './pages/CafeRegistrationForm';
import MenuUpload from './pages/MenuUpload';
import CafeLoginForm from './pages/CafeLoginForm';
import OrderUser from './pages/OrderUser';
import GetQR from './pages/GetQR';
import OrderPanelAdmin from './pages/OrderPanelAdmin';
import CartPage from './pages/CartPage';
import CategoryWiseDishes from './pages/CategoryWiseDishes';
import UserPage from './pages/UserPage';

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
        <Route path="/userInfo/:cafeId/:tableId" element={<UserPage />} />
        <Route path="/order/:cafeId/:tableId/:customer" element={<OrderUser />} />
        <Route path="/order/:cafeId/:tableId/:customer/:category" element={<CategoryWiseDishes />} />
        <Route path="/order/cart/:cafeId/:tableId/:customer" element={<CartPage />} />

        {/* ORDER PANEL ADMIN */}
        <Route path="/admin/:cafeId" element={<OrderPanelAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
