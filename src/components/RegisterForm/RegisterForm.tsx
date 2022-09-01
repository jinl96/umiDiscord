import { register } from '@/utils/requests';
import React, { useState } from 'react';
import { UmiApiResponse, useNavigate } from 'umi';
import { message } from 'antd';

export interface APIResponse {
    ok: string,
    status: number,
    json: () => Promise<{message: string, token:string}>
}

const RegisterForm = (): JSX.Element => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUp = () => {
        navigate('/login')
    }

    const onRegi = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (name === ''){
            message.warning('Name cannot be empty', 2)
            return;
        }
        if (password !== confirmPassword) {
            message.warning('Password and confirm password are not the same', 2)
            return;
        }
        else {
            try{
                const regiResult= await register({ email: email, password: password, name:name }) as APIResponse;
                if (regiResult.ok) {
                    const res = await regiResult.json()
                    localStorage.setItem('token', res.token)
                    navigate('/dashboard')
                }   else {
                    if (regiResult.status === 409){
                        message.warning('Email already registered', 2)
                    }   else {
                        message.warning('Something went wrong', 2)
                    }
                }
            }  catch (error:any){
                message.warning(error, 2)
            }
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-w-max">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign Up for Free
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Name
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={'text'}
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="User Name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="fonfirmassword"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Confirm Password"
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                }}
                            />
                        </div>
                    </div>


                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                            <h4 className='font-medium text-indigo-600 hover:text-indigo-50 pl-1'>Show Password</h4>
                        </div>

                        <div className="text-sm">
                            <a onClick={signUp} className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign In
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={(e) => onRegi(e)}
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            </span>
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm