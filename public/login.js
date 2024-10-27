const form = document.getElementById('form');
const username = localStorage.getItem('username');


// If the user is already logged in, redirect them to the game
if(username)
{
    window.location.href = 'game.html';
}

// Allow the user to set a name, then redirect them to the game
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        localStorage.setItem('username', input.value);
        input.value = '';
        window.location.href = 'game.html';
    }
  });