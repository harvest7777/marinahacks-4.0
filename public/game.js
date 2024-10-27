const socket = io();
const username = localStorage.getItem('username');
const duckHp = document.getElementById('duckHp');
const questionText = document.getElementById('questionText');
const choicesList = document.getElementById('choicesList');
const answerHistory = document.getElementById('answerHistory');
const sprite = document.getElementById('duck-sprite');

if(!username)
{
    window.location.href = 'index.html';
}
function logout()
{
    localStorage.removeItem('username');
    localStorage.removeItem('answered')
    // Redirect to login page
    window.location.href = 'index.html';
}



socket.on('updateHp', (newHp) => {
    duckHp.textContent = 'HP: ' + newHp;
})

socket.on('gameOver', (differenceInMinutes) => {
    window.location.href = 'gameover.html';

})

socket.on('userAnswer', (username, isCorrect)=>
{
    let answerResult = '✅+1 HP ';
    if(!isCorrect) answerResult='❌-5 HP ';
    const newItem = document.createElement('li');
    newItem.textContent = answerResult + '(' + username + ')';
    newItem.classList.add('answer-history');
    answerHistory.prepend(newItem);
})
socket.on('newQuestionData', (curQuestionNumber, questionData) =>
{
    //update the questiopn
    choicesList.innerHTML='';

    if(localStorage.getItem('answered')==curQuestionNumber)
    {
        questionText.textContent='You already answered the question!';
    }
    else
    {
        questionData.choices.forEach((choice, index) => {
            questionText.textContent=curQuestionNumber + 1 + '. ' +questionData.question;
            const newItem = document.createElement('li');
            newItem.textContent = choice;
            
            newItem.addEventListener('click', () =>
            {
                //store that you answered the question already to prevent answering twice
                localStorage.setItem('answered', curQuestionNumber);
                console.log('you just clicked ', index);
                
                //is it correct?
                let isCorret = index==questionData.correct;
                const result = document.createElement('li');
                if(isCorret)
                {
                    sprite.src="happy.gif"; 
                    result.textContent="✅ Come back later for the next question.";
                } 
                if(!isCorret)
                {
                    sprite.src="sad.gif";
                    result.textContent="❌ Come back later for the next question";

                }

                //let everyone know if u got it right or not
                console.log(isCorret);
                socket.emit('userAnswer', username, isCorret);
                //tell user if they got it right or not
                questionText.textContent=result.textContent;
                choicesList.innerHTML='';

            })

            newItem.classList.add('choice');
            choicesList.appendChild(newItem);
    });
    }
})

