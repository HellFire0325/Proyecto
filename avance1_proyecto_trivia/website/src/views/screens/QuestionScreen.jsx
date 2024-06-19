import { useState, useContext, useEffect } from 'react';
import { ApplicationContext } from '../../context/ApplicationContext';
import { useLocation } from 'react-router-dom';

import '../../styles/Questions.css'

export default function QuestionScreen () {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(100)

  const { darkMode } = useContext(ApplicationContext)

  const location = useLocation();
  const typeQuestion = location.state.typeQuestion;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          // Cuando el contador llega a cero, envía la respuesta seleccionada y pasa a la siguiente pregunta
          // client.send(JSON.stringify({ answer: selectedOption, question: questions[currentQuestion] }));
          setSelectedOption(null);
          setCurrentQuestion((prevQuestion) => prevQuestion + 1);
          return 100; // Reinicia el contador
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedOption, currentQuestion, typeQuestion]);

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
              return (
                <div className='card' style={darkMode ? cardStyleLight : cardStyleDark} key={index} onClick={() => handleOptionSelect(option)}>
                  <div className='card2' style={{ backgroundColor: colors[index]  }}>
                    <h3 style={{ color: 'white' }}>{option}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedOption && (
        <p>You selected: {selectedOption}</p>
      )}
    </div>
  );
};