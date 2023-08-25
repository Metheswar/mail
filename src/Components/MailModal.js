import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MailModal = ({ show, onClose, title, mail, time, date, subject }) => {
  return (
    <Modal show={show} onHide={onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="d-flex align-items-center">
  <p className="mb-0 me-2">Date & Time :</p>
  <h6 className="mb-0">{date} {time}</h6>
</div>

        <hr />
     
       <h6>Subject: {subject}</h6>

        <hr />
        <p>{mail}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MailModal;
