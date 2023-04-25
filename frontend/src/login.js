import React, { useState } from 'react';
import { Button, Checkbox, Form, Message, Label } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import validator from 'validator';

export default function Login({ setAdmin, setReadIn, setLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [success, setSuccess] = useState(true);
    const [validEmail, setValidEmail] = useState(false);
    const navigate = useNavigate();

    const host = "http://localhost:8000";

    const postData = async () => {
        if (checkbox) {
            const info = await fetch(`${host}/api/auth/login?email=${email}&password=${password}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await info.json();
            if (data.error === 'Please try to login with correct credentials') {
                setSuccess(false);
                setTimeout(() => {
                    setSuccess(true);
                }, 3000);
            } else {
                onLoggedIn();
                setSuccess(true);
                if (!data.user.isAdmin) {
                    localStorage.setItem('ID', data.user._id);
                    localStorage.setItem('Name', data.user.name);
                    localStorage.setItem('Email', data.user.email);
                    localStorage.setItem('Age', data.user.age);
                    localStorage.setItem('Salary', data.user.salary);
                    localStorage.setItem('Country', data.user.country);
                    localStorage.setItem('State', data.user.state);
                    localStorage.setItem('City', data.user.city);
                    localStorage.setItem('Date', data.user.date);
                    localStorage.setItem('Phone Number', data.user.phoneNumber);
                    localStorage.setItem('Flag', 1);
                    setAdmin(false);
                    navigate('/loginData');
                } else {
                    setReadIn(true);
                    setAdmin(true);
                    navigate('/read');
                }
            }
        }
    }

    const onLoggedIn = () => {
        setLoggedIn(true);
    }

    const validateEmail = (value) => {
        // let email = e.target.value

        if (validator.isEmail(value)) {
            setValidEmail(true);
        } else {
            setValidEmail(false);
        }
        setEmail(value);
    }

    return (
        <div>
            <Message error hidden={success}>
                <Message.Header>Fill the correct details</Message.Header>
                <p>Please fill the correct details !!!</p>
            </Message>

            <Form className="create-form">
                <Form.Field>
                    <label>Email</label>
                    <input placeholder='Email' onChange={({ target: { value } }) => validateEmail(value)} />
                    <div>
                        {(email.length > 0 && (!validEmail)) && <Label horizontal pointing color='red'>Enter a valid email</Label>}
                    </div>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <div>
                        {(password.length > 0 && password.length < 5) && <Label horizontal pointing color='red'>Minimum length must be 5</Label>}
                    </div>
                </Form.Field>
                <div className='login'>
                    <Form.Field>
                        <Checkbox label='I agree to the Terms and Conditions' onChange={(e) => setCheckbox(!checkbox)} />
                    </Form.Field>
                    {/* <Link to='/loginData'> */}
                    <Button active onClick={postData} type='submit'>Sign In</Button>
                    {/* </Link> */}
                </div>
            </Form>
        </div>
    )
}