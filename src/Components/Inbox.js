import React, { useEffect, useState } from 'react';
import { ListGroup, Badge, Modal, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios'; // Import Axios
import MailModal from './MailModal';
import { useDispatch, useSelector } from 'react-redux';
import { inboxHandler, unreadHandler } from '../Store/mailReducer';

const Inbox = () => {
  const dispatch = useDispatch();
  const inboxData = useSelector((state)=>state.mail.inboxData)
  const [showMail,setShowMail] = useState(false);
  const unreadmessages = useSelector((state)=>state.mail.unread)
  const showMailHandler =(key)=>{
    setShowMail((prevState)=> !prevState);
    readHandler(key)
  }
  const deleteHandler = async (key , event)=>{
    event.stopPropagation();
    const emailValue = localStorage.getItem('email').replace(/[@.]/g, '');
    const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${emailValue}/inbox/${key}.json`;
    axios.delete(url)

  }


  
const readHandler = async (key) =>{
  const emailValue = localStorage.getItem('email').replace(/[@.]/g, '');  
const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${emailValue}/inbox/${key}.json`;
if(key){
  axios.patch(url,
    {read : true}
    )
    .then((response) => {
      // window.location.reload();
      // setIsEditing(false);
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
  
}
}


  return (
    <>
    <Container>
    <h1 className="inbox-heading">
    Inbox 
      <span><sup className="fs-8"><Badge bg={unreadmessages > 0 ? 'danger' : 'success'} className="ms-2 fs-6">{unreadmessages} Unread</Badge></sup></span>
      
  </h1>


    <ListGroup className="inbox-list">
      {inboxData && Object.keys(inboxData)
        .reverse()
        .map((key, index) => (
          <ListGroup.Item key={index} className='p-0' action onClick={()=>{showMailHandler(key);}}>
            <Row className='p-0'>
              <Col xs={2} className='p-0 border-end m-1'>
              <div className="d-flex align-items-center">
              <small className='d-none ms-2 ms-md-3 d-md-block'>{inboxData[key].date}</small>&nbsp;
              <small className='ms-3 ms-md-0 d-md-block'>{inboxData[key].time}</small>
              </div>
              </Col>
              <Col xs={7} className='p-0 border-end mt-1'>
    <div className="d-flex align-items-center">
    <Badge bg={inboxData[key].read ? 'success' : 'danger'} className="me-2 rounded-circle"><span></span></Badge>
      <p className='inbox-sender-name mb-0'>{decodeURIComponent(inboxData[key].sender)}</p>
    </div>
  </Col>
              <Col xs={2} className='p-0 m-1'>
              <Button variant="danger" onClick={(event) => deleteHandler(key, event)}> Delete</Button>

              </Col>
            </Row>
            {showMail && <MailModal show={showMail} onClose={showMailHandler} title={decodeURIComponent(inboxData[key].sender)} mail = {inboxData[key].mail} time={inboxData[key].time} date={inboxData[key].date} subject={inboxData[key].subject} />}
          </ListGroup.Item>
        ))}
    </ListGroup>
  </Container>

  </>
  );
};

export default Inbox;