import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogoGmail } from 'react-icons/bi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { BsSendFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Store/authReducer';
import { Badge } from 'react-bootstrap';

function Header() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const unreadmessages = useSelector((state)=>state.mail.unread)
  const dispatch = useDispatch();
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const Navigate = useNavigate();
  const logoutHandler = () =>{
    localStorage.removeItem('email');
    localStorage.removeItem('token')
  dispatch(logout());
  Navigate('/')
  }

  return (
    <>
      <Navbar bg='dark' variant='dark'>
      
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              className="menu-button"
              onClick={handleShowOffcanvas}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 48 48"
                fill='white'
              >
                <path d="M 6 9 A 2.0002 2.0002 0 1 0 6 13 L 42 13 A 2.0002 2.0002 0 1 0 42 9 L 6 9 z M 6 22 A 2.0002 2.0002 0 1 0 6 26 L 42 26 A 2.0002 2.0002 0 1 0 42 22 L 6 22 z M 6 35 A 2.0002 2.0002 0 1 0 6 39 L 42 39 A 2.0002 2.0002 0 1 0 42 35 L 6 35 z"></path>
              </svg>
            </Button>
            <Navbar.Brand href="#home" className="ms-2"><h2>Mail Client</h2></Navbar.Brand>
          </div>
        
      </Navbar>

      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} className={"xs"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start" id="menu" onClick={handleCloseOffcanvas}>
            <li className="nav-item mb-3">
              <NavLink to="/compose" className="text-truncate text-decoration-none fs-5 ">
                <BiLogoGmail className='fs-5' />
                <span className="ms-1 d-sm-inline">Compose Mail</span>
              </NavLink>
            </li>
            <li className="nav-item mb-3">
              <NavLink to="/inbox" className="text-truncate text-decoration-none fs-5 " >
                <HiOutlineMailOpen /><span className="ms-1 d-sm-inline">Inbox</span> <span><Badge bg={unreadmessages > 0 ? 'danger' : 'success'} className="ms-2 fs-6">{unreadmessages} Unread</Badge></span>
              </NavLink>
            </li>
            <li className="nav-item mb-3">
              <NavLink to="/sent" className="text-truncate text-decoration-none fs-5">
                <BsSendFill /><span className="ms-1 d-sm-inline">Sent</span>
              </NavLink>
            </li>
          </ul>
       
        </Offcanvas.Body>
        <Button variant="danger" onClick={logoutHandler} className="rounded-0">Logout</Button>
      </Offcanvas>
    </>
  );
}

export default Header;
