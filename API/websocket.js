const axios = require('axios')
const io = require('socket.io')(4000, {
    cors: {
        origin: '*'
    }
})

function AlertUserOfFriendRequest(socketID, userWhoRequested) {
    const message = {
        name: userWhoRequested.name,
        username: userWhoRequested.username,
        userID: userWhoRequested._id
    }
    io.to(socketID).emit('notify-request-friend', message)
}

function AlertUserFriendAccept(socketID, userWhoRequested) {
    const message = {
        name: userWhoRequested.name,
        username: userWhoRequested.username,
    }

    io.to(socketID).emit('notify-accept-friend', message)
}

function AlertUserOfGameInvite(socketID, userWhoInvited, invite) {
    const message = {
        name: userWhoInvited.name,
        username: userWhoInvited.username,
        inviteID: invite._id
    }
    io.to(socketID).emit('notify-game-invite', message)
}

function CreateOrJoinRoom(user, roomKey) {
    console.log('roomKey', roomKey)
    const socket = io.sockets.sockets.get(user.socket_id)
    if(!socket) {
        console.log(`Socket Create/Join Room :: Unable to find socket with ID: ${user.socket_id}`)
        return false
    }

    socket.join(roomKey)

    const message = {
        name: user.name,
        username: user.username,
        key: roomKey
    }

    socket.to(roomKey).emit('user-join-game', message)
    return true
}

function DeleteRoom(roomKey) {
    try {
        io.socketsLeave(roomKey)
        return true
    } catch (error) {
        console.log(`Socket Delete Room :: ${error}`)
        return false
    }
}

function LeaveRoom(user, roomKey) {
    const socket = io.sockets.sockets.get(user.socket_id)
    if(!socket) {
        console.log(`Socket Leave Room :: Unable to find socket with ID: ${user.socket_id}`)
        return false
    }
    socket.leave(roomKey)

    const message = {
        name: user.name,
        username: user.username,
        key: roomKey
    }

    socket.to(roomKey).emit('user-leave-game', message)
    return true
}

function DisconnectSocket(socketID) {
    if(!socketID) return

    io.in(socketID).disconnectSockets(true)
}

function StartGame(user, roomKey, question) {
    const socket = io.sockets.sockets.get(user.socket_id)
    if(!socket) {
        console.log(`Socket Start Game :: Unable to find socket with ID: ${user.socket_id}`)
        return false
    }

    socket.join(roomKey)

    const message = {
        name: user.name,
        username: user.username,
        key: roomKey,
        question
    }

    socket.to(roomKey).emit('move-to-game-page', message)
    return true
}

function Score(user, roomKey, score) {
    const socket = io.sockets.sockets.get(user.socket_id)
    if(!socket) {
        console.log(`Socket Update Score :: Unable to find socket with ID: ${user.socket_id}`)
        return false
    }

    const message = {
        user,
        score
    }
    console.log('message', message.user._id)
    socket.to(roomKey).emit('update-score', message)

    return true
}

function SendScore(user, sessionKey, scoreUsers) {

    const socket = io.sockets.sockets.get(user.socket_id)
    if(!socket) {
        console.log(`Socket Update Score :: Unable to find socket with ID: ${user.socket_id}`)
        return false
    }

    const scoreUsersOrdered = scoreUsers.sort((a, b) => b.score - a.score)
    const userIdWinner = scoreUsersOrdered[0]._id

    const message = { 
        scoreUsers,
        userIdWinner
    }

    socket.to(sessionKey).emit('get-userscore', message)

    return true
}


module.exports = {
    AlertUserOfFriendRequest,
    AlertUserFriendAccept,
    AlertUserOfGameInvite,

    CreateOrJoinRoom,
    DeleteRoom,
    LeaveRoom,
    StartGame,
    Score,
    SendScore,
    
    DisconnectSocket,
}