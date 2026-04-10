import { Routes, Route } from 'react-router-dom'
import Layout from '../layouts/Layout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import Menu from '../pages/Menu'
import ProductDetail from '../pages/ProductDetail'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Checkout from '../pages/Checkout'
import ProtectedRoute from '../components/ProtectedRoute'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminCreateProduct from '../pages/admin/AdminCreateProduct'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminCustomers from '../pages/admin/AdminCustomers'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="menu" element={<Menu />} />
        <Route path="product/:id" element={<ProductDetail />} />
        
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<AdminCreateProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
