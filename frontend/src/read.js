import React, { useState, useEffect } from 'react';
import { Table, Button, Search, Grid, Pagination, Header, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import './App.css';

export default function Read() {
    const [employees, setEmployees] = useState([]);
    const [dummyData, setDummyData] = useState([]);
    const [dummyEmployees, setDummyEmployess] = useState([]);
    const [begin, setBegin] = useState(0);
    const [end, setEnd] = useState(2);
    const host = "http://localhost:8000";

    const getData = async () => {
        const info = await fetch(`${host}/api/auth/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

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
        // getData();
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

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            <div className='icon'>
                {/* <Icon name='user agent' size='large' /> */}
                <Header size='small' as='h2'>
                    <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' />
                </Header>
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
                            <Table.HeaderCell>Checked</Table.HeaderCell>
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
                                    {/* <Table.Cell>
                                        <Dropdown
                                            placeholder='Select Country'
                                            fluid
                                            selection
                                            options={countryOptions}
                                        />
                                    </Table.Cell> */}
                                    <Table.Cell>{data.state}</Table.Cell>
                                    <Table.Cell>{data.city}</Table.Cell>
                                    {/* <Table.Cell>
                                        <Dropdown
                                            placeholder='Select State'
                                            fluid
                                            selection
                                            options={countryOptions}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            placeholder='Select City'
                                            fluid
                                            selection
                                            options={countryOptions}
                                        />
                                    </Table.Cell> */}
                                    <Table.Cell>{data.phoneNumber}</Table.Cell>
                                    <Table.Cell>{data.date}</Table.Cell>
                                    <Table.Cell>{'Checked'}</Table.Cell>
                                    <Link to='/update'>
                                        <Table.Cell>
                                            <Button active onClick={() => setData(data)} >Update</Button>
                                        </Table.Cell>
                                    </Link>
                                    <Table.Cell>
                                        <Button active onClick={() => onDelete(data._id)}>Delete</Button>
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