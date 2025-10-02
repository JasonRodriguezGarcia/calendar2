// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// http://localhost:5000/api/v1/users?summary=count
// import UsersPage from './pages/UsersPage';
// import EventsPage from './pages/EventsPage';
import EventsCalendarPage from './pages/EventsCalendarPage';
import HolidaysPage from './pages/HolidaysPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import HolidaysViewPage from './pages/HolidaysViewPage';
import WinterAfternoonsPage from './pages/WinterAfternoonsPage';
import ContactsPage from './pages/ContactsPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import NewPasswordPage from './pages/NewPasswordPage';

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/eventos" element={<EventsCalendarPage />} />
                <Route path="/holidays" element={<HolidaysPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editprofile" element={<EditProfilePage />} />
                <Route path="/staffholidays" element={<HolidaysViewPage />} />
                <Route path="/winterafternoons" element={<WinterAfternoonsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/passwordrecovery" element={<PasswordRecoveryPage />} />
                <Route path="/newpassword/:id" element={<NewPasswordPage />} />
                {/* <Route path="/about" element={<HolidaysViewPage />} /> */}
                
                {/* <Route path="/" element={<DashboardPage />} />
                    <Route path="/descriptions/new" element={<DescriptionsFormInsertPage />} />
                    <Route path="/descriptions/view/:id" element={<DescriptionsView />} />
                    <Route path="/descriptions/view/:id/ia" element={<DescriptionsViewIA />} />
                    <Route path="/descriptions/edit/:id" element={<DescriptionsFormEditPage />} /> */}
            </Routes>
        </BrowserRouter>  );
}

export default App;
