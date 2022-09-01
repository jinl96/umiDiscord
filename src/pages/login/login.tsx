import React, { useState } from 'react';
import { defineConfig, useLocation, useNavigate } from 'umi';
import styles from './login.less';
import { Button, Checkbox, Form, Input } from 'antd';
import LoginForm from '@/components/LoginForm/LoginForm';
import RegisterForm from '@/components/RegisterForm/RegisterForm';

export type LoginProps = {
};


export const Login = ({ }: LoginProps): JSX.Element => {
  const location = useLocation().pathname as string;
  const navigate = useNavigate();

  const signUp = () => {
    navigate('/register')
  }

  return (
    <div className={styles.loginContainer}>
      {location === '/login' && <LoginForm/>}
      {location ==='/register' && <RegisterForm/>}
    </div>)
  
}

export default Login;