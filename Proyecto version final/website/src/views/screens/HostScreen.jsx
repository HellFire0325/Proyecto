import { useState, useContext, useEffect } from 'react';
import { ApplicationContext } from '../../context/ApplicationContext';
import { SessionContext } from '../../context/SessionContext';
import { SocketContext } from '../../context/SocketContext'
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../IGNORE/URLs';
import { TIME_QUESTIONS } from '../../config/RoomConfig'

export default function HostScreen () {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(TIME_QUESTIONS)

  const { SendScore } = useContext(SessionContext)
  const { darkMode } = useContext(ApplicationContext)
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  const location = useLocation();
  const typeQuestion = location.state.typeQuestion;
  let activeSessionUsers = location.state.activeSessionUsers ?? []

  socket.on("update-score", (message) => {
    activeSessionUsers.forEach(user => {
      if (user._id === message.user._id) {
        user.score = message.score
      }
    });
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setSelectedOption(null);
          setCurrentQuestion((prevQuestion) => {
            if (prevQuestion + 1 < typeQuestion.length) {
              // Si todavía hay preguntas, pasa a la siguiente
              return prevQuestion + 1;
            } else {
              // Si no hay más preguntas, redirige a otra página
              SendScore(activeSessionUsers) 
              navigate('/podium', { state: { activeSessionUsers } });
              return prevQuestion;
            }
          });
          return TIME_QUESTIONS;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedOption, currentQuestion, typeQuestion, history]);
  
  return (
    <div className='page-container-centered-top'>
      {typeQuestion[currentQuestion] && (
        <div className='container' id={darkMode?'dark':''}>
          <h2 id={darkMode?'dark':''}>{typeQuestion[currentQuestion].question}</h2>
          <br />
          <img src={typeQuestion[currentQuestion].url} alt='question' width='600' height='300' />
        </div>
      )}
      <div className="sessionConnectedUsers" id={darkMode ? 'dark' : ''}>
        {activeSessionUsers && activeSessionUsers.length > 0 ?
          activeSessionUsers.map(user => {
            return (
              <>
                <div key={user._id} className="sessionUser noselect" id={darkMode ? 'dark' : ''}>
                  <img className='sessionUserAvatar' src={`${API_URL}/avatar/${user.username}.png`}/>
                  <span className='sessionUserName'>{user.name}</span>
                    <div className='badge'>
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
  );
};