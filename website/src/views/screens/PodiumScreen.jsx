import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../context/ApplicationContext';
import { SocketContext } from '../../context/SocketContext'

import { API_URL } from '../../IGNORE/URLs';


export default function PodiumScreen () { 

  const { darkMode, UpdateScore } = useContext(ApplicationContext)
  const { socket } = useContext(SocketContext)

  const location = useLocation();
  const activeSessionUsers = (location.state.activeSessionUsers ?? []).sort((a, b) => b.score - a.score);
  let saved = false;

  useEffect(() => {
    socket.emit("score-players", activeSessionUsers)
    if (!saved) {
      console.log('activeSessionUsers', activeSessionUsers[0])
      UpdateScore(activeSessionUsers[0]._id, activeSessionUsers[0].score)
      saved = true;
    }
    
  }, [])

  return (
    <div className='page-container-centered-top'>
      <div className='container'>
        <h1 style={{ marginBottom: 50 }}>Podium</h1>
        {activeSessionUsers && activeSessionUsers.length > 0 ?
          activeSessionUsers.map(user => {
            return (
              <>
                <div key={user._id} className="sessionUser noselect" id={darkMode ? 'dark' : ''}>
                  <img className='sessionUserAvatar' src={`${API_URL}/avatar/${user.username}.png`}/>
                  <span className='sessionUserName'>{user.name}</span>
                    <div className='badge' key={user._id}>
                      <p style={{ fontSize: 15 }}> {user.score} </p>
                    </div>
                </div>
              </>
            )
          })
          : ''
        }
      </div>
    </div>
  )
}