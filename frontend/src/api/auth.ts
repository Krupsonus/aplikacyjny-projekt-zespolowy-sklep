import client from './client';
import type { User, LoginData, RegisterData } from '../types';

export async function fetchMe(): Promise<User> {
  const { data } = await client.get<User>('/auth/me');
  return data;
}

export async function apiLogin(payload: LoginData): Promise<User> {
  const { data } = await client.post<User>('/auth/login', payload);
  return data;
}

export async function apiRegister(payload: RegisterData): Promise<User> {
  const { data } = await client.post<User>('/auth/register', payload);
  return data;
}

export async function apiLogout(): Promise<void> {
  await client.post('/auth/logout');
}
