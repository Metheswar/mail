import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Header from './Components/Header';
import Login from './Components/Login';
import Compose from './Components/Compose';
import Inbox from './Components/Inbox';
import Sent from './Components/Sent';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './Store/authReducer';
import axios from 'axios';
import { inboxHandler, outboxHandler, unreadHandler } from './Store/mailReducer';
function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  useEffect(()=>{
   const token = localStorage.getItem('token');
   const email = localStorage.getItem('email')
   if(!!token && !!email){
    dispatch(login())
   }
  },[])
  useEffect(() => {
   if(isAuthenticated){
    const emailValue = localStorage.getItem('email').replace(/[@.]/g, '');
    const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${emailValue}/inbox.json`;
  
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const inboxData = response.data;
          dispatch(inboxHandler(inboxData))
          const unreadCount = Object.keys(inboxData).reduce((count, key) => {
            if (!inboxData[key].read) {
              return count + 1;
            }
            return count;
          }, 0);
          dispatch(unreadHandler(unreadCount))
        }
      } catch (error) {
        console.log('Error', error);
      }
    };
  
    // Initial fetch
    fetchData();
  
    // Fetch data periodically
    const interval = setInterval(fetchData, 2000);
  
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
   }
  }, [isAuthenticated]);
  useEffect(() => {
    if(isAuthenticated){
      const emailValue = localStorage.getItem('email').replace(/[@.]/g, '');
    const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${emailValue}/outbox.json`;
  
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const outboxData = response.data;
          dispatch(outboxHandler(outboxData))
        }
      } catch (error) {
        console.log('Error', error);
      }
    };
  
    // Initial fetch
    fetchData();
  
    // Fetch data periodically
    const interval = setInterval(fetchData, 2000);
  
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
    }
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Compose /> : <Login />} />
        {isAuthenticated && (
          <Route path="/" element={<Outlet />}>
            <Route path="/compose" element={<Compose />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/sent" element={<Sent />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
