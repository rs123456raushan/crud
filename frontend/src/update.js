import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Dropdown, Label } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import 'semantic-ui-css/semantic.min.css';
import validator from 'validator';

export default function Update() {
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
    const [validEmail, setValidEmail] = useState(false);
    const navigate = useNavigate();

    // let countryData = [];
    // let stateData = [];
    // let cityData = [];

    const host = "http://localhost:8000";

    const updateEmployeeData = async (id) => {
        if (checkbox && (validEmail || email.length === 0)) {
            const info = await fetch(`${host}/api/auth/updateuser/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, age, email, salary, country, state, city, phoneNumber, password })
            });
            const data = await info.json();
            localStorage.setItem('ID', data.getUsers._id);
            localStorage.setItem('Name', data.getUsers.name);
            localStorage.setItem('Email', data.getUsers.email);
            localStorage.setItem('Age', data.getUsers.age);
            localStorage.setItem('Salary', data.getUsers.salary);
            localStorage.setItem('Country', data.getUsers.country);
            localStorage.setItem('State', data.getUsers.state);
            localStorage.setItem('City', data.getUsers.city);
            localStorage.setItem('Date', data.getUsers.date);
            localStorage.setItem('Phone Number', data.getUsers.phoneNumber);
            localStorage.setItem('Flag', 1);
            navigate('/loginData');
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
        // stateData = data.value;
        getCity();
    }

    const handleCity = (e, data) => {
        setCity(e.target.textContent);
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
        getState();
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
        getCity();
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

    const [id, setID] = useState(null);

    useEffect(() => {
        setID(localStorage.getItem('ID'))
        // getCountry();
    }, []);

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
                        <Checkbox label='I agree to the Terms and Conditions' checked={checkbox} onChange={(e) => setCheckbox(!checkbox)} />
                    </Form.Field>
                </div>
                <div className='login'>
                    {/* <Link to='/loginData'> */}
                    <Button active onClick={() => updateEmployeeData(id)} type='submit'>Update</Button>
                    {/* </Link> */}
                </div>
            </Form>
        </div>
    )
}