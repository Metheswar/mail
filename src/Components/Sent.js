import React, { useEffect, useState } from 'react';
import { ListGroup, Badge, Modal, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios'; // Import Axios
import MailModal from './MailModal';
import { useDispatch, useSelector } from 'react-redux';
import { outboxHandler } from '../Store/mailReducer';

const Sent = () => {
  const outboxData = useSelector((state)=> state.mail.outboxData);
  const dispatch = useDispatch();
  const [showMail,setShowMail] = useState(false);
  const showMailHandler =()=>{
    setShowMail((prevState)=> !prevState)
  }

  const deleteHandler = async (key , event)=>{
    event.stopPropagation();
    const emailValue = localStorage.getItem('email').replace(/[@.]/g, '');
    const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${emailValue}/outbox/${key}.json`;
    axios.delete(url)

  }


  

  return (
    <>
    <Container>
    <h1 className="inbox-heading">Outbox</h1>
    <ListGroup className="inbox-list">
      {outboxData && Object.keys(outboxData)
        .reverse()
        .map((key, index) => (
          <ListGroup.Item key={index} className='p-0' action onClick={showMailHandler}>
            <Row className='p-0'>
              <Col  xs={2} className='p-0 border-end m-1'>
              <div className="d-flex align-items-center">
              <small className='d-none ms-2 ms-md-3 d-md-block'>{outboxData[key].date}</small>&nbsp;
              <small className='ms-3 ms-md-0 d-md-block'>{outboxData[key].time}</small>
              </div>
              </Col>
              <Col xs={7} className='p-0 border-end m-1' >
                <p className='inbox-sender-name'>{decodeURIComponent(outboxData[key].receiver)}</p>
              </Col>
              <Col xs={2} className='p-0 mt-1'>
              <Button variant="danger" onClick={(event) => deleteHandler(key, event)}> Delete</Button>
              </Col>
            </Row>
            {showMail && <MailModal show={showMail} onClose={showMailHandler} title={decodeURIComponent(outboxData[key].receiver)} mail={outboxData[key].mail} time={outboxData[key].time} date={outboxData[key].date} subject={outboxData[key].subject}/>}
          </ListGroup.Item>
        ))}
    </ListGroup>
  </Container>

  </>
  );
};

export default Sent;
