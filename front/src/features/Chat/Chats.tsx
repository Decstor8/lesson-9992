import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { selectAllUsers, selectAllUsersLoading } from '../Users/getUsersSlice';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { getUsers } from '../Users/usersThunks';
import { selectUser } from '../Users/usersSlice';
import { ChatMessage, IncomingChatMessage } from '../../types';

const Chat = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(selectAllUsers);
    const user = useAppSelector(selectUser);
    const isLoading = useAppSelector(selectAllUsersLoading);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageText, setMessageText] = useState('');

    const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingChatMessage;

            setMessages(prevState => [...prevState, decodedMessage.payload]);

            console.log(decodedMessage.payload);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }
    }, []);

    useEffect(() => {
        const fetchUrl = async () => {
            await dispatch(getUsers());
        };

        void fetchUrl();
    }, [dispatch]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ws.current) return;

        ws.current.send(JSON.stringify({ type: 'SEND_MESSAGE', message: messageText }));

        setMessageText('');
    };

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={4} sx={{ border: '2px solid #1976d2', p: 2, borderRadius: 2 }}>
                <Typography component="div" variant="h6" sx={{ mb: 4, borderBottom: '2px solid #1976d2', pb: 1 }}>
                    Online Users
                </Typography>
                {!isLoading ? (
                    users.map((elem) => (
                        user && user._id !== elem._id && (
                            <Grid item key={elem._id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <Avatar />
                                {elem.displayName}
                            </Grid>
                        )
                    ))
                ) : (
                    <CircularProgress />
                )}
            </Grid>
            <Grid item xs={8} sx={{ border: '2px solid #1976d2', p: 2, borderRadius: 2 }}>
                <Typography component="div" variant="h6" sx={{ mb: 4, borderBottom: '2px solid #1976d2', pb: 1 }}>
                    Chat Room
                </Typography>
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 2, p: 1, border: '1px solid #ddd' }}>
                    {messages.map((message, idx) => (
                        <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                            <b>{message.author}: </b> {message.message}
                        </Typography>
                    ))}
                </Box>
                <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        required
                        label="Message"
                        name="messageText"
                        value={messageText}
                        onChange={changeMessage}
                        fullWidth
                    />
                    <Button type="submit" variant="contained">Send</Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Chat;
