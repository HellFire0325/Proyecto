import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../context/ApplicationContext';
import { SocketContext } from '../../context/SocketContext'

export default function WinnerLoserScreen () {

  const { socket } = useContext(SocketContext)
  const location = useLocation();
  const { darkMode, userData } = useContext(ApplicationContext)
  console.log('userData', userData)

  const usersScore = (location.state.message)

  console.log('usersScore', usersScore)

  const msgWinner = "¡Felicidades Ganaste!"
  const gifWinner = "https://media.giphy.com/media/l0HUnQR733uhm48UM/giphy.gif"
  const msgLoser = "¡Lo siento, perdiste!"
  const gifLoser =  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzIwaHlkNXZrbmhjemtwNWtqbXVnaWJkMmQzOHI2eGJvaGU1eHNkbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/10h8CdMQUWoZ8Y/giphy.webp"

  let userWinner = null;



  return (
    <div className='page-container-centered-top'>
      <div className='container'>
        <h1 style={{ marginBottom: 50 }}>
          {usersScore.userIdWinner === userData._id ? msgWinner : msgLoser}
        </h1>
        <br />
        <img src={usersScore.userIdWinner === userData._id ? gifWinner : gifLoser} alt='winnerloser' width='600' height='300' />
      </div>
    </div>
  )
}