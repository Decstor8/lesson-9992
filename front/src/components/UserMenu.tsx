import React, {useState} from 'react';
import {UserTypes} from '../types';
import {Button, Menu, MenuItem} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {logout} from '../features/Users/usersThunks';
import {useAppDispatch} from '../App/hooks';

interface Props {
    user: UserTypes;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <Button color="inherit" onClick={handleClick}>
                Hello, {user.displayName}!
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} keepMounted>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;