import React, { useState, useContext } from 'react';
import InputField from '../components/InputField';

import '../../styles/Form.css'
import { Link } from 'react-router-dom';
import { ApplicationContext } from '../../context/ApplicationContext';
import { FormButton } from '../components/Button';

export default function LoginScreen(props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [validUsername, setValidUsername] = useState(true)
    const [validPassword, setValidPassword] = useState(true)

    const { darkMode, Login } = useContext(ApplicationContext)

    const inputRegex = /[^A-Za-z0-9]/

    function HandleUsername(event) {
        const value = event.target.value
        setValidUsername(true)
        setUsername(value)
    }

    function HandlePassword(event) {
        setValidPassword(true)
        setPassword(event.target.value)
    }

    function TryLogin() {
        if(validUsername === false || validPassword === false) return

        Login(username, password)
    }

    return (
        <div id='register' className='page-container-centered'>
            <div className='form' id={ darkMode ? 'formDark' : '' }>
                <h1>Login</h1>
                <InputField
                    title='Usuario'
                    value={username}
                    required={true}
                    warningMessage={username !== '' ? 'No puede contener un caracter especial o excede los 15 caracteres.' : 'Debe ingresar un usuario.'}
                    maxLength={15}
                    regex={inputRegex}
                    tabIndex={0}
                    onChange={(value) => setUsername(value)}
                    onValidityChange={valid => setValidUsername(valid)}
                    />
                <InputField
                    title='Contraseña'
                    value={password}
                    required={true}
                    secure={true}
                    warningMessage={'Debe ingresar una contraseña.'}
                    tabIndex={0}
                    onChange={(value) => setPassword(value)}
                    onValidityChange={valid => setValidPassword(valid)}
                    />
                
                <div className='horizontal-container'>
                    <span>No tienes una cuenta? </span><Link to='/register'>Registrate</Link>
                </div>

                <div className='horizontal-flex-center-spread'>
                    <FormButton value='Ingresar' onPush={TryLogin} tabIndex={0} />
                </div>
            </div>
        </div>
    );
}