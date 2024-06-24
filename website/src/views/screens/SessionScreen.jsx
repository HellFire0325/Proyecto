import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { ApplicationContext } from '../../context/ApplicationContext';
import { SessionContext } from '../../context/SessionContext';
import { SocketContext } from '../../context/SocketContext'
import {InputButton} from '../components/Button';
import UserInviteOverlay from '../components/UserInviteOverlay';

import '../../styles/Session.css'
import ProfileItem from '../components/ProfileItem';
import { API_URL } from '../../IGNORE/URLs';

export default function SessionScreen(props) {

    const navigate = useNavigate()

    const location = useLocation();
    const creator = location.state.creator;

    const { darkMode } = useContext(ApplicationContext)
    const {
        activeSession,
        activeSessionUsers,
        activeSessionHosted,
        DeleteSession,
        VerifySession,
        LeaveSession,
        StartGame
    } = useContext(SessionContext)

    const [ overlayActive, setOverlayActive ] = useState(false)

    const { socket } = useContext(SocketContext)

    useEffect(() => {
        VerifySession()
    }, [])

    useEffect(()=>{
        if (!creator) {
            socket.emit("move-to-game-page", activeSession)
            navigate('/waitingroom')
        }
    }, [socket])

    return (
        <>
        {overlayActive ? <UserInviteOverlay onClose={() => setOverlayActive(false)} />:''}
        <div className='session'>
            <div className='sessionConfig'>
            <h1 className='noselect'>{activeSession.title}</h1>
            <br />
            <h2>{activeSession.key}</h2>
            {activeSessionHosted ?
            <>
                <InputButton
                    value='Comenzar'
                    styling='positive'
                    onPush={() => StartGame(activeSession.key, location.state.question)}
                />
                <InputButton
                    value='Borrar'
                    styling='negative'
                    onPush={() => DeleteSession(activeSession._id)}
                />
                </>
                :
                <>
                <InputButton
                    value='Leave'
                    styling='negative'
                    onPush={() => LeaveSession(activeSession._id)}
                />
            </>
            }
            </div>
            
            <div className="sessionConnectedUsers" id={darkMode ? 'dark' : ''}>
                {activeSessionUsers && activeSessionUsers.length > 0 ?
                    activeSessionUsers.map(user => {
                        return (
                            <>
                            <div key={user._id} className="sessionUser noselect" id={darkMode ? 'dark' : ''}>
                                <img className='sessionUserAvatar' src={`${API_URL}/avatar/${user.username}.png`}/>
                                <span className='sessionUserName'>{user.name}</span>
                            </div>
                            </>
                        )
                    })
                :''}
            </div>

        </div>
        </>
    );
}