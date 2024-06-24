import { useState, useContext, useEffect } from 'react';
import { ApplicationContext } from '../../context/ApplicationContext';
import { SessionContext } from '../../context/SessionContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { TIME_QUESTIONS } from '../../config/RoomConfig'

import '../../styles/Questions.css'

export default function QuestionScreen () {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(TIME_QUESTIONS)
  const [score, setScore] = useState(0)
  let sendResponse = false

  const { UpdateScore } = useContext(SessionContext)
  const { darkMode } = useContext(ApplicationContext)
  const navigate = useNavigate()

  const location = useLocation();
  const typeQuestion = location.state.typeQuestion;

  const handleOptionSelect = (optionSelected, optionCorrect) => {
    if (selectedOption !== null) return
    setSelectedOption(optionSelected);
    if (!sendResponse) {
      if (optionSelected === optionCorrect) {
        setScore(score + 1)
        UpdateScore(score + 1);
      }
    } else {
      if (optionSelected === optionCorrect) {
        setScore(score + 1)
        UpdateScore(score + 1);
      } else {
        setScore(score - 1)
        UpdateScore(score - 1);
      }
    }
    sendResponse = true
  };

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
              // navigate('/winnerloser');
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
      <div className='container' id={darkMode?'dark':''}>
        <h1>A Responder!</h1>
        <br />
        <div class="loader">
          <div class="loader_cube loader_cube--color" style={{ backgroundImage: darkMode ? 'linear-gradient(135deg, #1A34FB, #FF00F7)' : 'linear-gradient(135deg, #d5fb1a, #ff4800)' }}></div>
          <div class="loader_cube loader_cube--glowing"></div>
          <p style={{ fontSize: 25, fontWeight: 'bold' }}>{timer}</p>
        </div>
      </div>

      {typeQuestion[currentQuestion] && (
        <div className='container' id={darkMode?'dark':''}>
          <h2 id={darkMode?'dark':''}>{typeQuestion[currentQuestion].question}</h2>
            <br />
            <img src={typeQuestion[currentQuestion].url} alt='question' width='600' height='300' />
            <div className='containerCard'>
              {typeQuestion[currentQuestion].options.map((option, index) => {
                const colors = ['#E32242', '#1A6DD0', '#D9A10A', '#2E8D15'];
                const cardStyleLight = {
                  backgroundImage: `linear-gradient(163deg, #f4eeed 0%, #efe8ef 100%)`
                }
                const cardStyleDark = { 
                  backgroundImage: `linear-gradient(163deg, #101010 0%, #101010 100%)`
                }
                const cardStyleSelected = {
                  backgroundImage: ''
                }
                return (
                  <div 
                    className='card' 
                    style={selectedOption !== null && option !== selectedOption ? cardStyleSelected : (darkMode ? cardStyleLight : cardStyleDark)}
                    key={index} 
                    onClick={() => handleOptionSelect(option, typeQuestion[currentQuestion].correct)}
                  >
                    <div className='card2' style={{ backgroundColor: selectedOption !== null && option !== selectedOption ? '#808080' : colors[index]  }}>
                      <h3 style={{ color: 'white' }}>{option}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      )}

      {/* {selectedOption && (
        <p>You selected: {selectedOption}</p>
      )} */}
    </div>
  );
};