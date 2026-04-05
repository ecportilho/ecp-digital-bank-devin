import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { DashboardPage } from '@/pages/Dashboard'
import { PixPage } from '@/pages/Pix'
import { ExtratoPage } from '@/pages/Extrato'
import { CardsPage } from '@/pages/Cards'
import { PaymentsPage } from '@/pages/Payments'
import { ProfilePage } from '@/pages/Profile'
import { NotificationsPage } from '@/pages/Notifications'

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pix" element={<PixPage />} />
            <Route path="/extrato" element={<ExtratoPage />} />
            <Route path="/cartoes" element={<CardsPage />} />
            <Route path="/pagamentos" element={<PaymentsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/notificacoes" element={<NotificationsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
