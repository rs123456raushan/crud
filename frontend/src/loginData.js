import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Search, Grid, Pagination, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import './App.css';

export default function LoginData() {
    const [employees, setEmployees] = useState([]);
    const [dummyData, setDummyData] = useState([]);
    const [dummyEmployees, setDummyEmployees] = useState([]);
    const [id, setId] = useState(null);
    const inputFile = useRef(null);
    const [success, setSuccess] = useState(true);
    const host = "http://localhost:8000";

    const onDelete = async (id) => {
        const info = await fetch(`${host}/api/auth/deleteuser/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        await info.json();
        setEmployees([]);
        setDummyData([]);
        setDummyEmployees([]);
    }

    const setData = async (data) => {
        let { id, name, age, email, salary, country, state, city, phoneNumber, checkbox } = data;
        localStorage.setItem('ID', id);
        localStorage.setItem('Name', name);
        localStorage.setItem('Email', email);
        localStorage.setItem('Age', age);
        localStorage.setItem('Salary', salary);
        localStorage.setItem('Country', country);
        localStorage.setItem('State', state);
        localStorage.setItem('City', city);
        localStorage.setItem('Phone Number', phoneNumber);
        localStorage.setItem('Checkbox Value', checkbox);
        localStorage.setItem('Flag', 1);
    }

    const searchChange = (e) => {
        let filteredUser = dummyEmployees.filter((data) => {
            return data.name.toLowerCase().includes(e.target.value.toLowerCase());
        });
        setEmployees(filteredUser);
    }

    const pageChange = (event, { activePage }) => {
        let begin = activePage * 2 - 2;
        let end = activePage * 2;
        setEmployees(dummyData.slice(begin, end));
        setDummyEmployees(dummyData.slice(begin, end));
    }

    const handleFileChange = async (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],

        }
        let formData = new FormData();
        formData.append('file', img.data);
        let res = await fetch(`${host}/api/auth/updateuser/${id}`, {
            method: 'PUT',
            body: formData,
        })
        if(res.statusText === 'OK'){
            setSuccess(false);
            setTimeout(() => {
                setSuccess(true);
            }, 3000);
        }
    }

    const handleSubmit = (e, _id) => {
        e.preventDefault();
        inputFile.current.click();
        setId(_id);
    }

    useEffect(() => {
        let obj = {};
        obj.id = localStorage.getItem('ID');
        obj.name = localStorage.getItem('Name');
        obj.age = localStorage.getItem('Age');
        obj.email = localStorage.getItem('Email');
        obj.salary = localStorage.getItem('Salary');
        obj.country = localStorage.getItem('Country');
        obj.state = localStorage.getItem('State');
        obj.city = localStorage.getItem('City');
        obj.date = localStorage.getItem('Date');
        obj.phoneNumber = localStorage.getItem('Phone Number');
        obj.password = localStorage.getItem('Password')
        let array = [];
        array.push(obj);
        setEmployees(array);
        setDummyData(array);
        setDummyEmployees(array);
    }, [])

    return (
        <div>
            <div className='msg'>
                <Message compact positive hidden={success}>
                    <Message.Header>File uploaded successfully</Message.Header>
                    <p>You have upload a file successfully !!!</p>
                </Message>
            </div>

            <div className='searchlogin'>
                <Grid>
                    <Grid.Column width={6}>
                        <Search placeholder='Search...' onSearchChange={searchChange} showNoResults={false} />
                    </Grid.Column>
                </Grid>
            </div>
            <div className='table'>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Age</Table.HeaderCell>
                            <Table.HeaderCell>E-mail address</Table.HeaderCell>
                            <Table.HeaderCell>Salary</Table.HeaderCell>
                            <Table.HeaderCell>Country</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>City</Table.HeaderCell>
                            <Table.HeaderCell>Phone Number</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>File</Table.HeaderCell>
                            <Table.HeaderCell>Update</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {employees.map((data) => {
                            return (
                                <Table.Row>
                                    <Table.Cell>{data.name}</Table.Cell>
                                    <Table.Cell>{data.age}</Table.Cell>
                                    <Table.Cell>{data.email}</Table.Cell>
                                    <Table.Cell>{data.salary}</Table.Cell>
                                    <Table.Cell>{data.country}</Table.Cell>
                                    <Table.Cell>{data.state}</Table.Cell>
                                    <Table.Cell>{data.city}</Table.Cell>
                                    <Table.Cell>{data.phoneNumber}</Table.Cell>
                                    <Table.Cell>{data.date}</Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <input onChange={(e) => handleFileChange(e)}
                                                type="file"
                                                className="inputfile"
                                                id="embedpollfileinput"
                                                ref={inputFile}
                                            />
                                            {/* <label htmlFor="embedpollfileinput" className="ui small red floated button">
                                                <i className="ui upload icon"></i>
                                                Upload
                                            </label> */}
                                            <button
                                                type="submit"
                                                className="ui small red floated button"
                                                id="embedpollfileinput"
                                                onClick={(e) => handleSubmit(e, data.id)}>
                                                <i className="ui upload icon"></i>
                                                Upload
                                            </button>
                                        </div>
                                    </Table.Cell>
                                    <Link to='/update'>
                                        <Table.Cell>
                                            <Button active size='small' onClick={() => setData(data)}>Update</Button>
                                        </Table.Cell>
                                    </Link>
                                    <Table.Cell>
                                        <Button active size='small' onClick={() => onDelete(data.id)}>Delete</Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <div className='pagination'>
                    <Pagination defaultActivePage={1} totalPages={5} onPageChange={pageChange} />
                </div>
            </div>
        </div>
    )
}