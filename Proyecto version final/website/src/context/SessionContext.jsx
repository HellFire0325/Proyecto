import React, { createContext, useContext, useLayoutEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from "axios";

import { API_URL, SESSION_URL } from '../IGNORE/URLs'
import { ApplicationContext } from "./ApplicationContext";
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
} from "../utils/questions";

export const SessionContext = createContext()


export const SessionProvider = ({ children }) => {
    const navigate = useNavigate()
    const [activeSession, setActiveSession] = useState()
    const [activeSessionUsers, setActiveSessionUsers] = useState([])
    const [activeSessionHosted, setActiveSessionHosted] = useState(false)

    const [hostedSessions, setHostedSessions] = useState()
    const [connectedSessions, setConnectedSessions] = useState()

    const [topics, setTopics] = useState([])
    const [difficulties, setDifficulties] = useState([])
    const { userData, Loading } = useContext(ApplicationContext)

    function SetActiveSession(session, hosted) {
        console.log(`Set Active Session :: ${session}`)

        setActiveSession(session)
        setActiveSessionHosted(hosted)
        navigate('/session')
    }

    function GoToActiveSession(creator, topic = 0, difficulty = 0) {
        navigate('/session', { state: { creator, question: { topic, difficulty }, typeQuestion: {} } })
    }

    function GoToQuestions(question) {
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
        navigate('/host', { state: { typeQuestion, host: true, activeSessionUsers } })
        window.localStorage.setItem('host', true)
    }

    function GoToPodium() {
        navigate('/podium', { state: { activeSessionUsers } })
    }

    function CreateSession(title, topic, difficulty) {
        Loading(true)
        axios.post(`${SESSION_URL}/create`, {
            userID: userData._id,
            authKey: userData.authKey,
            title,
            topic,
            difficulty
        }).then(res => {
            if(res.data.success === true) {
                setActiveSession(res.data.session)
                setActiveSessionHosted(true)
                GoToActiveSession(true, topic, difficulty)
                console.log('Successfully created a new game.')
            }
            Loading(false)
        }).catch(error => {
            console.log(`Create Session Error :: ${error}`)
            Loading(false)
        })
    }

    function JoinSession(sessionKey) {
        Loading(true)
        axios.post(`${SESSION_URL}/join`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionKey
        }).then(res => {
            if(res.data.success === true) {
                setActiveSession(res.data.session)
                setActiveSessionHosted(false)
                GoToActiveSession(false)
                console.log('Successfully joined game.')
            }
            Loading(false)
        }).catch(error => {
            console.log(`Join Session Error :: ${error}`)
            Loading(false)
        })
    }

    function StartGame(sessionKey, question = { topic: 0, difficulty: 0 }) {
        Loading(true)
        axios.post(`${SESSION_URL}/startgame`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionKey,
            question
        }).then(res => {
            if(res.data.success === true) {
                GoToQuestions(question)
                console.log('Successfully start game.')
            }
            Loading(false)
        }).catch(error => {
            console.log(`Start Game Error :: ${error}`)
            Loading(false)
        })
    }

    function UpdateScore(score) {
        // Loading(true)
        axios.post(`${SESSION_URL}/updatescore`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionKey: activeSession.key,
            score
        }).then(res => {
            // if(res.data.success === true) {
            //     GoToQuestions(question)
            //     console.log('Successfully start game.')
            // }
            console.log('Successfully update score.')
            // Loading(false)
        }).catch(error => {
            console.log(`Update Score Error :: ${error}`)
            Loading(false)
        })
    }

    function SendScore(score) {
        axios.post(`${SESSION_URL}/sendscore`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionKey: activeSession.key,
            scoreUsers: score
        }).then(res => {
            // if(res.data.success === true) {
            //     GoToQuestions(question)
            //     console.log('Successfully start game.')
            // }
            console.log(res)
            console.log('Successfully received score.')
            // Loading(false)
        }).catch(error => {
            console.log(`Received Score Error :: ${error}`)
            Loading(false)
        })
    }

    function DeleteSession(sessionID) {
        Loading(true)
        axios.post(`${SESSION_URL}/delete`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionID
        }).then(res => {
            if(res.data.success === true) {
                setActiveSession()
                setActiveSessionHosted(false)
                navigate('/')
                console.log(`${res.data.message}`)
            }
            Loading(false)
        }).catch(error => {
            console.log(`Create Session Error :: ${error}`)
            Loading(false)
        })
    }

    function VerifySession(sessionID, userID) {
        
    }

    function LeaveSession(sessionID) {
        Loading(true)
        axios.post(`${SESSION_URL}/leave`, {
            userID: userData._id,
            authKey: userData.authKey,
            sessionID
        }).then(res => {
            if(res.data.success === true) {
                console.log('Successfully left game.')
            }
            setActiveSession()
            setActiveSessionHosted(false)
            navigate('/')
            Loading(false)
        }).catch(error => {
            console.log(`Leave Session Error :: ${error}`)
            Loading(false)
        })
    }

    function InviteToSession(userToInviteID, sessionID, callback) {
        axios.post(`${SESSION_URL}/invite`, {
            userID: userData._id,
            authKey: userData.authKey,
            userToInviteID,
            sessionID
        }).then(res => {
            if(res.data.success === true) {
                console.log(res.data.message)
                callback ? callback() : ''
            }
        }).catch(error => {
            console.log(`Invite To Session Error :: ${error}`)
        })
    }

    function AcceptInvite(inviteID, callback) {
        Loading(true)
        axios.post(`${SESSION_URL}/invite/accept`, {
            userID: userData._id,
            authKey: userData.authKey,
            inviteID
        }).then(res => {
            if(res.data.success === true) {
                setActiveSession(res.data.session)
                setActiveSessionHosted(false)
                GoToActiveSession(false)
                console.log('Successfully joined game.')

                callback ? callback() : ''
            }
            Loading(false)
        }).catch(error => {
            console.log(`Invite Accept Error :: ${error}`)
            Loading(false)
        })
    }

    function RemoveInvite(inviteID, callback) {
        axios.post(`${SESSION_URL}/invite/remove`, { inviteID })
        .then(res => {
            if(res.data.success === true) {
                console.log(res.data.message)
                callback ? callback() : ''
            }
        })
        .catch(error => {
            console.log(`Invite Remove Error :: ${error}`)
        })
    }


    function GetConnectedUsers(key) {
        axios.get(`${SESSION_URL}/get/users/${key}`)
        .then(res => {
            if(res.data.success === true) {
                setActiveSessionUsers(res.data.users)
            } else {
                setActiveSessionUsers([])
            }
        }).catch(err => {
            console.log(`Failed To Fetch User Sessions: ${err}`)
        })
    }


    useLayoutEffect(() => {
        axios.get(`${API_URL}/configdata`)
        .then(res => {
            setTopics(res.data.topics)
            setDifficulties(res.data.difficulties)
        }).catch(err => {
            console.log(`Failed To Fetch Topics: ${err}`)
        })

        GetConnectedUsers(activeSession ? activeSession.key : 'none')
    }, [activeSession, activeSessionHosted])

    return (
        <SessionContext.Provider value={{
            topics,
            difficulties,
            activeSession,
            activeSessionUsers,
            activeSessionHosted,
            hostedSessions,
            connectedSessions,
            GoToActiveSession,
            SetActiveSession,
            CreateSession,
            DeleteSession,
            JoinSession,
            VerifySession,
            LeaveSession,
            GetConnectedUsers,
            InviteToSession,
            AcceptInvite,
            RemoveInvite,
            StartGame,
            UpdateScore,
            GoToPodium,
            SendScore
        }}>
            {children}
        </SessionContext.Provider>
    )
}