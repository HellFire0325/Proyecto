import React, { useContext, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios'
import { ApplicationContext } from '../../context/ApplicationContext';
import { API_URL } from '../../IGNORE/URLs';

import '../../styles/Profile.css'
import EditProfileOverlay from '../components/EditProfileOverlay';
import { FriendsContext } from '../../context/FriendsContext';
import { SessionContext } from '../../context/SessionContext';

export default function ProfileScreen(props) {

    const { user } = useParams()
    const { darkMode, userData, EditProfile } = useContext(ApplicationContext)
    // const { AcceptFriend, DeclineFriendRequest } = useContext(FriendsContext)
    // const { hostedSessions, connectedSessions, SetActiveSession, AcceptSessionInvite, RemoveSessionInvite } = useContext(SessionContext)

    const [profileData, setProfileData] = useState()

    const [isLocalProfile, setIsLocalProfile] = useState(false)
    const [editProfile, setEditProfile] = useState(false)

    const [notificationData, setNotificationData] = useState()

    function OnEditSubmit(firstName, lastName, username) {
        setEditProfile(false)
        if(isLocalProfile === false) return

        EditProfile(firstName, lastName, username)
    }

    function GetProfileData() {
        axios.get(`${API_URL}/users/${user}`)
        .then(res => {
            if(res.data.success === false) {
                setProfileData(undefined)
            } else {
                setProfileData(res.data.user)
                if(user === userData.username)
                {
                    setIsLocalProfile(true)
                }
            }
            
        }).catch(e => {
            console.log(e)
        })
    }

    function GetNotificationData() {
        axios.get(`${API_URL}/users/notifications/${userData._id}/${userData.authKey}`)
        .then(res => {
            if(res.data.success === false) {
                setNotificationData(undefined)
            } else {
                setNotificationData(res.data.data)
            }
        }).catch(e => {
            console.log(e)
        })
    }

    useLayoutEffect(() => {
        GetProfileData()
        GetNotificationData()
    }, [user, userData])

    return (
        <div className='page-container-centered-top'>
            {profileData === undefined ?
            <h1>Usuario no encontrado!</h1>
            :
            <>
            {editProfile ? <EditProfileOverlay profileData={profileData} onSubmit={OnEditSubmit} onCancel={() => setEditProfile(false)} /> : ''}
            <div className='profileHeading' id={darkMode ? 'profileHeadingDark' : ''}>
                <div className='profileAvatar' id={darkMode ? 'profileDataDark' : ''}>
                    <img src={`${API_URL}/avatar/${profileData.username}.png`} />
                </div>
                
                <div className='profileData' id={darkMode ? 'profileDataDark' : ''}>
                    <div className="profileDataHeader">
                        <h1 className='profileName'>{profileData.name}</h1>
                    </div>
                    
                    <div className="horizontal-flex-center">
                        <h2 className='profileGeneralStat'>Score: {profileData.score}</h2>
                    </div>
                    <h2 className='profileUsername' id={darkMode ? 'profileUsernameDark' : ''}>{profileData.username}</h2>
                    <h3 className='profileMinorStat'>Jugador desde: {profileData.createdAt.substring(0,10)}</h3>
                    
                </div>
            </div>

            </>
            }
        </div>
    );
}
