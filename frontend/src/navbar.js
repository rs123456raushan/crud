import React, { useEffect, useState } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function Navbar({ readIn, loggedIn, setReadIn, setLoggedIn }) {
    const [activeItem, setActiveItem] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
        navigate(location.pathname);
    }

    const handleClick = (e) => {
        setActiveItem('signIn');
        setLoggedIn(false);
        setReadIn(false);
    }

    const urlChange = () => {
        if (location.pathname === '/') {
            setActiveItem('home');
        } else if (location.pathname === '/adminCreate') {
            setActiveItem('admin');
        } else if (location.pathname === '/create') {
            setActiveItem('signUp');
        } else if (location.pathname === '/login') {
            setActiveItem('signIn');
        }
    }

    useEffect(() => {
        urlChange();
        // eslint-disable-next-line
    }, [location])

    return (
        <Segment inverted>
            <Menu inverted pointing secondary>
                <Link to='/'>
                    {
                        !(readIn || loggedIn) && <Menu.Item
                            name='home'
                            active={activeItem === 'home'}
                            onClick={handleItemClick}
                        />
                    }
                </Link>
                <Link to='/adminCreate'>
                    {
                        !(readIn || loggedIn) && <Menu.Item
                            name='admin'
                            active={activeItem === 'admin'}
                            onClick={handleItemClick}
                        />
                    }
                </Link>
                <Menu.Menu position='right'>
                    <Link to='/login'>
                        {
                            !(readIn || loggedIn) && <Menu.Item
                                name='signIn'
                                active={activeItem === 'signIn'}
                                onClick={handleItemClick}
                            />
                        }
                    </Link>
                    <Link to='/create'>
                        {
                            !(readIn || loggedIn) && <Menu.Item
                                name='signUp'
                                active={activeItem === 'signUp'}
                                onClick={handleItemClick}
                            />
                        }
                    </Link>
                    <Link to='/login'>
                        {
                            (readIn || loggedIn) &&
                            <Menu.Item
                                name='signOut'
                                active={true}
                                onClick={handleClick}
                            />
                        }
                    </Link>
                </Menu.Menu>
            </Menu>
        </Segment>
    )
}