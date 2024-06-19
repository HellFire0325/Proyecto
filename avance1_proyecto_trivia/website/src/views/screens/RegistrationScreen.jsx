import React, { useContext, useState } from 'react';
import InputField from '../components/InputField';

import '../../styles/Form.css'
import { Link } from 'react-router-dom';
import { ApplicationContext } from '../../context/ApplicationContext';
import { FormButton } from '../components/Button';
import { NO_SPEC_CHAR, NO_SPEC_CHAR_ALLOW_SPACE } from '../../config/REGEX';

export default function RegistrationScreen(props) {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [validFirstName, setValidFirstName] = useState(true)
    const [validLastName, setValidLastName] = useState(true)
    const [validUsername, setValidUsername] = useState(true)
    const [validPassword, setValidPassword] = useState(true)
    const [validConfirmPassword, setValidConfirmPassword] = useState(true)

    const { darkMode, Register } = useContext(ApplicationContext)

    function TryRegister() {
        if(validFirstName === false && validLastName === false && validUsername === false && validPassword === false && validConfirmPassword === false) return
        
        if(confirmPassword !== password) {
            setValidConfirmPassword(false)
            return
        }

        Register(name, username, password)
    }

    return (
        <div id='register' className='page-container-centered'>
            <div className='form' id={ darkMode ? 'formDark' : '' }>
                <h1>Registro</h1>
                <InputField title={'Nombre'}
                    value={name}
                    warningMessage={name !== '' ? 'No puede tener caracteres especiales o mas de 30 caracteres' : 'Debe ingresar un nombre.'}
                    required={true}
                    maxLength={30}
                    regex={NO_SPEC_CHAR_ALLOW_SPACE}
                    tabIndex={0}
                    onValidityChange={valid => setValidFirstName(valid)}
                    onChange={value => setName(value)}
                    />
                <InputField title={'Usuario'}
                    value={username}
                    warningMessage={username !== '' ? 'No puede tener caracteres especiales o mas de 15 caracteres.' : 'Debe ingresar un usuario.'}
                    required={true}
                    maxLength={15}
                    regex={NO_SPEC_CHAR}
                    tabIndex={0}
                    onValidityChange={valid => setValidUsername(valid)}
                    onChange={value => setUsername(value)}
                    />
                <InputField title={'Contraseña'}
                    value={password}
                    warningMessage={password !== '' ? 'Debe ingresar al menos 8 caracteres.' : 'Debe ingresar una contraseña.'}
                    required={true}
                    secure={true}
                    tabIndex={0}
                    onValidityChange={valid => setValidPassword(valid)}
                    onChange={value => setPassword(value)}
                    />
                <InputField title={'Confirmar Contraseña'}
                    value={confirmPassword}
                    warningMessage={'Las contraseñas no coinciden...'}
                    warn={!validConfirmPassword}
                    required={true}
                    secure={true}
                    tabIndex={0}
                    onValidityChange={valid => setValidConfirmPassword(valid)}
                    onChange={value => setConfirmPassword(value)}
                    />
                
                <div className='horizontal-flex-center'>
                    <span>Ya tienes una cuenta? </span> <Link to='/login'> Ingresar</Link>
                </div>

                <div className='horizontal-flex-center-spread'>
                    <FormButton value='Registrarse' tabIndex={0} onPush={TryRegister} />
                </div>
            </div>
        </div>
    );
}