// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// http://localhost:5000/api/v1/users?summary=count
// import UsersPage from './pages/UsersPage';
// import EventsPage from './pages/EventsPage';
import EventsCalendarPage from './pages/EventsCalendarPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';

const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/eventos" element={<EventsCalendarPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editprofile" element={<EditProfilePage />} />
                
                {/* <Route path="/" element={<DashboardPage />} />
                    <Route path="/descriptions/new" element={<DescriptionsFormInsertPage />} />
                    <Route path="/descriptions/view/:id" element={<DescriptionsView />} />
                    <Route path="/descriptions/view/:id/ia" element={<DescriptionsViewIA />} />
                    <Route path="/descriptions/edit/:id" element={<DescriptionsFormEditPage />} /> */}
            </Routes>
        </BrowserRouter>  );
}

export default App;
