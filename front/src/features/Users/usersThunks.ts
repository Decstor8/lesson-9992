import {createAsyncThunk} from '@reduxjs/toolkit';
import {GlobalError, LoginMutation, RegisterMutation, RegisterResponse, ValidationError} from '../../types';
import {isAxiosError} from 'axios';
import {unsetUser} from './usersSlice';
import axiosApi from "../../axiosApi";

export const newUser = createAsyncThunk<RegisterResponse, RegisterMutation, {rejectValue: ValidationError}>(
    'users/register',
    async (registerMutation, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post('/users', registerMutation);
            return response.data;
        } catch (err) {
            if (isAxiosError(err) && err.response && err.response.status === 422) {
                return rejectWithValue(err.response.data);
            }

            throw err;
        }
    }
);

export const loginUser = createAsyncThunk<RegisterResponse, LoginMutation, {rejectValue: GlobalError}>(
    'users/login',
    async (loginMutation, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post<RegisterResponse>('users/sessions', loginMutation);
            return response.data;
        } catch (err) {
            if (isAxiosError(err) && err.response && err.response.status === 422) {
                return rejectWithValue(err.response.data);
            }

            throw err;
        }
    },
);

export const googleLogin = createAsyncThunk<RegisterResponse, string, {rejectValue: GlobalError}>(
    'google/login',
    async (credential, {rejectWithValue}) => {
        try {
            const response = await axiosApi.post('/users/google', {credential});
            return response.data;
        } catch (err) {
            if (isAxiosError(err) && err.response && err.response.status === 422) {
                return rejectWithValue(err.response.data);
            }

            throw err;
        }
    },
);

export const logout = createAsyncThunk<void, undefined>(
    'users/logout',
    async (_, {dispatch},) => {

        axiosApi.delete('users/sessions');
        dispatch(unsetUser());
    },
);