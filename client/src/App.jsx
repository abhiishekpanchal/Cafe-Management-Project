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
        {/* ROOT ROUTE */}
        <Route path="/" element={<CafeLoginForm />} />

        {/* CAFE REGISTRATION & MENU MANAGEMENT */}
        <Route path="register" element={<CafeRegistrationForm />} />
        <Route path="menu/:cafeId">
          <Route index element={<MenuUpload />} /> 
          <Route path="getQR" element={<GetQR />} />
        </Route>

        {/* USER ORDERING */}
        <Route path="order/:cafeId/:tableId/:customer">
          <Route index element={<OrderUser />} />
          <Route path=":category" element={<CategoryWiseDishes />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* USER INFORMATION */}
        <Route path="userInfo/:cafeId/:tableId" element={<UserPage />} />

        {/* ADMIN ORDER PANEL */}
        <Route path="admin/:cafeId" element={<OrderPanelAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
