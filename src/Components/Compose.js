import React, { useState, useRef } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Card, Form, Button, FloatingLabel, FormControl } from 'react-bootstrap';
import axios from 'axios'; // Import Axios

const Compose = () => {
  const toAddress = useRef();
  const subject = useRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };



  const handleComposeClick = async () => {

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let toemailValue = toAddress.current.value;

    if (!toemailValue.match(emailFormat)) {
      setIsEmailValid(false);
      return;
    }
    toemailValue = toemailValue.replace(/[@.]/g, '');
    setIsEmailValid(true);
    const currentTime = new Date(); 
    console.log(currentTime);
    

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const date = currentTime.getDate();
    const Month = currentTime.getMonth();
    const year = currentTime.getFullYear();

    const senderMail = encodeURIComponent(localStorage.getItem('email'));
    const mail = {
      sender: senderMail,
      subject: subject.current.value,
      mail: editorState.getCurrentContent().getPlainText(),
      read : false,
      time : `${hours}:${minutes}`,
      date : `${date}-${Month}-${year}`
    };

    const url = `https://mail-client-app-project-default-rtdb.firebaseio.com/${toemailValue}/inbox.json`;

    try {
      const response = await axios.post(url, mail, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('Failed to store data into Firebase.');
      }
    } catch (error) {
      console.log('Error', error);
    } finally{
      const sendmailHandler = async () =>{
        const userMail = decodeURIComponent(senderMail).replace(/[@.]/g, '')
        const url2 = `https://mail-client-app-project-default-rtdb.firebaseio.com/${userMail}/outbox.json`;
        const mail2 = {
          receiver: encodeURIComponent(toAddress.current.value),
          subject: subject.current.value,
          mail: editorState.getCurrentContent().getPlainText(),
          read : false,
          time : `${hours}:${minutes}`,
          date : `${date}-${Month}-${year}`
        }
        try {
          const response = await axios.post(url2, mail2, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.data) {
            throw new Error('Failed to store data into Firebase.');
          }
        } catch (error) {
          console.log('Error', error);
        }
    
      }
      sendmailHandler()
      toAddress.current.value='';
      subject.current.value='';
      setEditorState(EditorState.createEmpty())
    }

  };

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Compose Mail</Card.Title>
          <Form>
            <FloatingLabel label="To:" className='mb-3'>
              <FormControl type="email" ref={toAddress} placeholder="To" required />
              {!isEmailValid && <p className="text-danger">Invalid email format</p>}
            </FloatingLabel>
            <FloatingLabel label="Subject" className='mb-3'>
              <FormControl type="text" ref={subject} placeholder="Subject" required />
            </FloatingLabel>
            <Form.Group controlId="compose">
              <Form.Label>Compose:</Form.Label>
              <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorState={editorState}
                onEditorStateChange={handleEditorChange}

              />
            </Form.Group>
            <Button variant="primary" onClick={handleComposeClick}>
              Compose
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Compose;
