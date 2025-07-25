// TO DO
// - replantear espacios ya que contienen centro y espacio(despacho), crear tabla despachos
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import HomePage from './pages/HomePage';
// import ProfilePage from './pages/ProfilePage';
// import CatBouncePage from './pages/CatBouncePage';

// http://localhost:5000/api/v1/users?summary=count
// import UsersPage from './pages/UsersPage';
// import EventsPage from './pages/EventsPage';
// import PropDrillingHomePage from './pages/PropDrillingHomePage';
// import DashboardPage from './pages/DashBoardPage';
// import PropDrillingHomePage2 from './pages/PropDrillingHomePage2';
// import PasswordForm from './components/PasswordForm';
// import EmojiRender from './components/EmojiRender';
// import DogsComponent from './components/DogsComponent';

import EventsCalendarComponent from './components/EventsCalendarComponent';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<EventsCalendarComponent />} />


                {/* <Route path="/" element={<DashboardPage />} />

                <Route path="/propdrilling" element={<PropDrillingHomePage />} />
                <Route path="/propdrilling2" element={<PropDrillingHomePage2 />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/users" element={<UsersPage />} /> */}
                {/* <Route path="/" element={<HomePage />} /> */}
                {/* <Route path="/" element={<CatBouncePage />} /> */}
                {/* <Route path="/profile/:token" element={<ProfilePage />} /> */}
                    
                    {/* <Route path="/descriptions" element={<DescriptionsListPage />} />
                    <Route path="/descriptions/new" element={<DescriptionsFormInsertPage />} />
                    <Route path="/descriptions/view/:id" element={<DescriptionsView />} />
                    <Route path="/descriptions/view/:id/ia" element={<DescriptionsViewIA />} />
                    <Route path="/descriptions/edit/:id" element={<DescriptionsFormEditPage />} /> */}

                        
            </Routes>
        </BrowserRouter>  );
}

export default App;
