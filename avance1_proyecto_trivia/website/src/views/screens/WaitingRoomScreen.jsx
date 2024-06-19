import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { ApplicationContext } from '../../context/ApplicationContext';
import { SocketContext } from '../../context/SocketContext'
import { 
  EASY_MATH_QUESTION,
  MID_MATH_QUESTION,
  HARD_MATH_QUESTION,
  EASY_SCIENCE_QUESTION,
  MID_SCIENCE_QUESTION,
  HARD_SCIENCE_QUESTION,
  EASY_HISTORY_QUESTION,
  MID_HISTORY_QUESTION,
  HARD_HISTORY_QUESTION,
  EASY_PROGRAMMING_QUESTION,
  MID_PROGRAMMING_QUESTION,
  HARD_PROGRAMMING_QUESTION
} from "../../utils/questions";

import '../../styles/Questions.css'

export default function WaitingRoomScreen () {

  const navigate = useNavigate()

  const { darkMode } = useContext(ApplicationContext)

  const { socket } = useContext(SocketContext)

  socket.on("move-to-game-page", (message) => {
    const question = message.question;
    let typeQuestion = EASY_MATH_QUESTION;
    if (question.topic === 0 && question.difficulty === 0) {
      typeQuestion = EASY_MATH_QUESTION;
    } 
    if (question.topic === 0 && question.difficulty === 1) {
        typeQuestion = MID_MATH_QUESTION;
    }
    if (question.topic === 0 && question.difficulty === 2) {
        typeQuestion = HARD_MATH_QUESTION;
    }
    if (question.topic === 1 && question.difficulty === 0) {
        typeQuestion = EASY_SCIENCE_QUESTION;
    }
    if (question.topic === 1 && question.difficulty === 1) {
        typeQuestion = MID_SCIENCE_QUESTION;
    }
    if (question.topic === 1 && question.difficulty === 2) {
        typeQuestion = HARD_SCIENCE_QUESTION;
    }
    if (question.topic === 2 && question.difficulty === 0) {
        typeQuestion = EASY_HISTORY_QUESTION;
    }
    if (question.topic === 2 && question.difficulty === 1) {
        typeQuestion = MID_HISTORY_QUESTION;
    }
    if (question.topic === 2 && question.difficulty === 2) {
        typeQuestion = HARD_HISTORY_QUESTION;
    }
    if (question.topic === 3 && question.difficulty === 0) {
        typeQuestion = EASY_PROGRAMMING_QUESTION;
    }
    if (question.topic === 3 && question.difficulty === 1) {
        typeQuestion = MID_PROGRAMMING_QUESTION;
    }
    if (question.topic === 3 && question.difficulty === 2) {
        typeQuestion = HARD_PROGRAMMING_QUESTION;
    }
    navigate('/questions', { state: { typeQuestion } });
  });

  // useEffect(()=>{
  //   socket.on('move-to-game-page', (activeSession) => {
  //     console.log('socket', socket)
  //     navigate('/questions');
  //   });
  // }, [socket])

  return (
    <div className='page-container-centered-top'>
      <div className='container' id={darkMode?'dark':''}>
        <h1>Esperando que el host comience el juego...</h1>
      </div>

    </div>
  );
};