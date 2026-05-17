import { useContext } from 'react';
import { AdminAuthContext } from '../context/AdminAuthContextObject';

export const useAdminAuth = () => useContext(AdminAuthContext);