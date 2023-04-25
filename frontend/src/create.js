import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Dropdown, Label, Message } from 'semantic-ui-react';
import { Country, State, City } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import validator from 'validator';

export default function Create({ isAdmin }) {

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);
    const [salary, setSalary] = useState(0);
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [dummyCountry, setDummyCountry] = useState('');
    const [dummyState, setDummyState] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [checkbox, setCheckbox] = useState(false);
    const [success, setSuccess] = useState(true);
    const [validEmail, setValidEmail] = useState(false);
    const navigate = useNavigate();

    const host = "http://localhost:8000";

    const postData = async () => {
        if (name === '' || email === '' || age === 0 || salary === 0 || country === '' || state === '' || city === '' || password === '' || phoneNumber === '') {
            setSuccess(false);
            setTimeout(() => {
                setSuccess(true);
            }, 3000);
        } else if (checkbox) {
            setSuccess(true);
            const info = await fetch(`${host}/api/auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, age, email, salary, country, state, city, phoneNumber, password, isAdmin })
            });
            const data = await info.json();
            // if (data.errors.length > 0) {
            //     setSuccess(false);
            //     setTimeout(() => {
            //         setSuccess(true);
            //     }, 3000);
            // } else {
            setName(data.user.name);
            setAge(data.user.age);
            setEmail(data.user.email);
            setSalary(data.user.salary);
            setPhoneNumber(data.user.phoneNumber);
            setPassword(data.user.password);
            navigate('/login');
            // }
        }
    }

    const handleCountry = (e, data) => {
        setCountry(e.target.textContent);
        setDummyCountry(data.value);
        // countryData = data.value;
        // setState('');
        // setDummyState('');
        getState();
    }

    const handleState = (e, data) => {
        setState(e.target.textContent);
        setDummyState(data.value);
        // setFlag(false);
        // stateData = data.value;
        getCity();
    }

    const handleCity = (e, data) => {
        setCity(e.target.textContent);
        // setDummyCity(data.value);
        // cityData = data.value;
    }

    const getCountry = () => {
        let countryData = [];
        Country.getAllCountries().forEach(country => {
            countryData.push({
                key: country.name,
                text: country.name,
                value: country.isoCode
            })
            // setCountryOptions(prevArr => [...prevArr, {
            //     key: country.name,
            //     text: country.name,
            //     value: country.isoCode
            // }])
        });
        setCountryOptions(countryData);
        // getState();
    }

    const getState = () => {
        let stateData = [];
        State.getStatesOfCountry(dummyCountry).forEach(state => {
            stateData.push({
                key: state.name,
                text: state.name,
                value: state.isoCode
            })
            // setStateOptions(prevArr => [...prevArr, {
            //     key: state.name,
            //     text: state.name,
            //     value: state.isoCode
            // }])
        });
        setStateOptions(stateData);
        // getCity();
    }

    const getCity = () => {
        let cityData = [];
        City.getCitiesOfState(dummyCountry, dummyState).forEach(city => {
            cityData.push({
                key: city.name,
                text: city.name,
                value: city.name
            })
            // setCityOptions(prevArr => [...prevArr, {
            //     key: city.name,
            //     text: city.name,
            //     value: city.name
            // }])
        });
        setCityOptions(cityData);
        // setFlag(false);
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

    // useEffect(() => {
    //     getCountry();
    // }, [getCountry])

    useEffect(() => {
        getCountry();
    }, [country])

    useEffect(() => {
        getState();
    }, [country])

    useEffect(() => {
        getCity();
    }, [state])

    return (
        <div>
            <Message error hidden={success}>
                <Message.Header>You must fill all the details correctly</Message.Header>
                <p>Please fill out each field in the form below correctly to sign-up for a new account for yourself !!!</p>
            </Message>

            <Form className="create-form">
                <div className='create'>
                    <div>
                        <Form.Field>
                            <label>Name</label>
                            <input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Country</label>
                            <Dropdown
                                placeholder='Select Country'
                                fluid
                                selection
                                options={countryOptions}
                                onChange={handleCountry}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Salary</label>
                            <input placeholder='Salary' value={salary} onChange={(e) => setSalary(e.target.value)} />
                        </Form.Field>
                    </div>
                    <div>
                        <Form.Field>
                            <label>Email</label>
                            <input placeholder='Email' onChange={({ target: { value } }) => validateEmail(value)} />
                            <div>
                                {(email.length > 0 && (!validEmail)) && <Label horizontal pointing color='red'>Enter a valid email</Label>}
                            </div>
                        </Form.Field>
                        <div className='size'>
                            <Form.Field>
                                <label>State</label>
                                <Dropdown
                                    placeholder='Select State'
                                    fluid
                                    selection
                                    options={stateOptions}
                                    onChange={handleState}
                                    disabled={!(country && stateOptions.length)}
                                />
                            </Form.Field>
                        </div>
                        <Form.Field>
                            <label>Age</label>
                            <input placeholder='Age' value={age} onChange={(e) => setAge(e.target.value)} />
                            <div>
                                {(age > 0 && (age < 10 || age > 100)) && <Label horizontal pointing color='red'>Must be in range of 10 to 100</Label>}
                            </div>
                        </Form.Field>
                    </div>
                    <div>
                        <Form.Field>
                            <label>Password</label>
                            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                            <div>
                                {(password.length > 0 && password.length < 5) && <Label horizontal pointing color='red'>Minimum length must be 5</Label>}
                            </div>
                        </Form.Field>
                        <Form.Field>
                            <label>City</label>
                            <Dropdown
                                placeholder='Select City'
                                fluid
                                selection
                                options={cityOptions}
                                onChange={handleCity}
                                disabled={!(state && cityOptions.length)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Phone Number</label>
                            <input placeholder='Phone Number' onChange={(e) => setPhoneNumber(e.target.value)} />
                            <div>
                                {(phoneNumber.length > 0 && (phoneNumber.length <= 6 || phoneNumber.length >= 11)) && <Label horizontal pointing color='red'>Enter a valid phone number</Label>}
                            </div>
                        </Form.Field>
                    </div>
                </div>
                <div className='center'>
                    <Form.Field>
                        <Checkbox label='I agree to the Terms and Conditions' onChange={(e) => setCheckbox(!checkbox)} />
                    </Form.Field>
                </div>
                <div className='login'>
                    {/* <Link to='/read'> */}
                    <Button active onClick={postData} type='submit'>Sign Up</Button>
                    {/* </Link> */}
                </div>
            </Form>
        </div>
    )
}