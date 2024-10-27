const socket = io();
const survival = document.getElementById('survival');
socket.emit('userAnswer', 'xxx', false);
socket.on('gameOver', (timeAlive) => {
    survival.textContent = 'Mr. Silly thanks you. He survived for ' + timeAlive +  ' minutes thanks to your help!';
    localStorage.removeItem('username');
    localStorage.removeItem('answered');

})