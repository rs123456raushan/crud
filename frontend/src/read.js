import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Search, Grid, Pagination, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import './App.css';

export default function Read() {
    const [employees, setEmployees] = useState([]);
    const [dummyData, setDummyData] = useState([]);
    const [dummyEmployees, setDummyEmployess] = useState([]);
    const [image, setImage] = useState({ preview: '', data: '' })
    const [success, setSuccess] = useState(true);
    const [begin, setBegin] = useState(0);
    const [end, setEnd] = useState(2);
    const [id, setId] = useState(null);
    const inputFile = useRef(null);
    const host = "http://localhost:8000";

    const getData = async () => {
        const info = await fetch(`${host}/api/auth/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await info.json();
        setEmployees(data.slice(begin, end));
        setDummyData(data);
        setDummyEmployess(data.slice(begin, end));
    }

    const onDelete = async (id) => {
        const info = await fetch(`${host}/api/auth/deleteuser/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let data = await info.json();
        setEmployees(data.user.slice(begin, end));
        setDummyData(data.user);
        setDummyEmployess(data.user.slice(begin, end));
    }

    const setData = async (data) => {
        let { name, age, email, salary, country, state, city, phoneNumber } = data;
        localStorage.setItem('ID', data._id);
        localStorage.setItem('Name', name);
        localStorage.setItem('Email', email);
        localStorage.setItem('Age', age);
        localStorage.setItem('Salary', salary);
        localStorage.setItem('Country', country);
        localStorage.setItem('State', state);
        localStorage.setItem('City', city);
        localStorage.setItem('Phone Number', phoneNumber);
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
        setBegin(begin);
        setEnd(end);
        setEmployees(dummyData.slice(begin, end));
        setDummyEmployess(dummyData.slice(begin, end));
    }

    const handleFileChange = async (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        setImage(img);
        let formData = new FormData();
        formData.append('file', img.data);
        let res = await fetch(`${host}/api/auth/updateuser/${id}`, {
            method: 'PUT',
            body: formData,
        })
        if (res.statusText === 'OK') {
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
        getData();
        // eslint-disable-next-line
    }, [image])

    return (
        <div>
            <div className='msg'>
                <Message compact positive hidden={success}>
                    <Message.Header>File uploaded successfully</Message.Header>
                    <p>You have upload a file successfully !!!</p>
                </Message>
            </div>

            <div className='search'>
                <Grid>
                    <Grid.Column width={6}>
                        <Search placeholder='Search...' onSearchChange={searchChange} showNoResults={false} />
                    </Grid.Column>
                </Grid>
            </div>
            <div className='table'>
                <Table singleLine >
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
                                                onClick={(e) => handleSubmit(e, data._id)}>
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
                                        <Button active size='small' onClick={() => onDelete(data._id)}>Delete</Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                <div className='pagination'>
                    <Pagination defaultActivePage={1} totalPages={15} onPageChange={pageChange} />
                </div>
            </div>
        </div>
    )
}