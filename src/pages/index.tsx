import yayJpg from '../assets/yay.jpg';
import React from 'react';
import { verifyToken } from '@/utils/requests';
import { APIResponse } from '@/components/RegisterForm/RegisterForm';
import { useNavigate } from 'umi';


export default function HomePage() {
  let navigate = useNavigate();
  React.useEffect(() => {
    (async () => {
      try{
      const token = localStorage.getItem('token');
      if (token) {
        const verifyResult = await verifyToken() as APIResponse;
        if (verifyResult.ok) {
          const res = await verifyResult.json();
          navigate('/dashboard');
        }
      }
      navigate('/login')
    } catch (error) {
        navigate('/login')
      }
    })();
    }, [])
  return (
    <></>
  );
}
