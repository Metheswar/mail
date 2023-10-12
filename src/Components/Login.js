import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Form, Button, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login } from "../Store/authReducer";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [success,setSuccess] = useState('');
const [error,setError] = useState('')
const dispatch = useDispatch();
  const handleValidation = () => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setemailError("Email Not Valid");
    } else {
      setemailError("");
    }

    if (!password.match(/^[a-zA-Z]{4,22}$/)) {
      formIsValid = false;
      setpasswordError(
        "Only Letters and length must be min 4 Characters and Max 22 Characters"
      );
    } else {
      setpasswordError("");
    }

    if (activeTab === "signup" && password !== confirmPassword) {
      formIsValid = false;
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }

    return formIsValid;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
     
      console.log("Login submitted");
      const loginHandler = async () =>{
        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBsBi6XuiXEAJS8LypGcACrNuK5h8i494Y';
        try{
         const response = await fetch(url,{
           method:'POST',
           body: JSON.stringify({
             email: email,
               password: password,
               returnSecureToken: true,
           }),
           headers:{
             'Content-Type': 'application/json'
           },
         });
         if (response.ok) {
           const data = await response.json();
           console.log(data)
           setError('')
           setSuccess("Login Successfull!!")
           dispatch(login())
           localStorage.setItem('email',email)
           localStorage.setItem('token',data.idToken)
    
               
         } else {
           const errorData = await response.json();
            setError(errorData.error.message);

         }
        } catch(error){
         console.error('Error occurred:', error);
        } finally{
         setEmail('')
        setPassword('')
        }
       }
       loginHandler();
      }
      
    }


  const handleSignupSubmit =async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      
      console.log("Signup submitted");
      const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBsBi6XuiXEAJS8LypGcACrNuK5h8i494Y'; // Replace YOUR_API_KEY with your actual API key
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
 
        if (response.ok) {
          const data = await response.json();
          console.log(data)

            setError('')
          setSuccess('Signup Successfull')
          
 
        } else {
          const errorData = await response.json();
          setError(errorData.error.message);

        }
      } catch (error) {

        console.error('Error occurred:', error);
      } finally{
        setEmail('');
        setPassword('');
     
      }
 
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      console.log("Forgot password submitted");
        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBsBi6XuiXEAJS8LypGcACrNuK5h8i494Y';
        try {
            const response = await fetch(url, {
              method: 'POST',
              body: JSON.stringify({
                requestType:"PASSWORD_RESET",
                email: email,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            });
     
            if (response.ok) {
              const data = await response.json();
              console.log(data)

             setError('')
              setSuccess("Password Reset Link sent Successfully!!")
              
     
            } else {
              const errorData = await response.json();
              setError(errorData.error.message);
         
            }
          }catch (error) {
     
            console.error('Error occurred:', error);
          }finally{
            setEmail('')
          } 

    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container className=" mt-5 d-flex justify-content-center align-items-center">
      <Card className="p-5 mt-5" style={{ minWidth: "400px" }}>
        <Nav fill variant="tabs" defaultActiveKey="#login" onClick={()=> {setSuccess(''); setError('')}}>
          <Nav.Item>
            <Nav.Link href="#login" onClick={() => handleTabChange("login")}>
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#signup" onClick={() => handleTabChange("signup")}>
              Sign Up
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#forgot"
              onClick={() => handleTabChange("forgot")}
            >
              Forgot Password
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Card.Title className="text-center mt-4 mb-4">
          {activeTab === "login" && "Login "}
          {activeTab === "signup" && "Sign Up"}
          {activeTab === "forgot" && "Forgot Password"}
        </Card.Title>

        <Form
          onSubmit={
            activeTab === "login"
              ? handleLoginSubmit
              : activeTab === "signup"
              ? handleSignupSubmit
              : handleForgotSubmit
          }
        >
          {activeTab === "login" && (
            <>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Form.Text className="text-danger">{emailError}</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Form.Text className="text-danger">{passwordError}</Form.Text>
                <Form.Text className="text-danger">{error}</Form.Text>
                <Form.Text className="text-success">{success}</Form.Text>
              </Form.Group>
            </>
          )}

          {activeTab === "signup" && (
            <>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Form.Text className="text-danger">{emailError}</Form.Text>
                
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Form.Text className="text-danger">{passwordError}</Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <Form.Text className="text-danger">
                  {confirmPasswordError}
                </Form.Text>
                <Form.Text className="text-danger">{error}</Form.Text>
                <Form.Text className="text-success">{success}</Form.Text>
                
              </Form.Group>
            </>
          )}

          {activeTab === "forgot" && (
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(event) => setEmail(event.target.value)}
              />
              <Form.Text className="text-danger">{emailError}</Form.Text>
              <Form.Text className="text-danger">{error}</Form.Text>
              <Form.Text className="text-success">{success}</Form.Text>
            </Form.Group>
          )}
                
          <div className="d-flex justify-content-center mt-5">
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
