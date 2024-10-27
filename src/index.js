import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { start } from 'node:repl';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, '..','public')));

//this duck hp will be handled in the backend. it will be updated and sent back to users
let duckHp = 100;

//initialize start date so we can see how long mr silly was alive for
let startDate = new Date();


const duckQuizData = [
  {
      question: "What is a baby duck called?",
      choices: ["Chick", "Gosling", "Duckling", "Fry"],
      correct: 2 
  },
  {
      question: "Which breed of duck is commonly raised for meat?",
      choices: ["Peking", "Muscovy", "Indian Runner", "Mallard"],
      correct: 0 
  },
  {
      question: "Ducks can live in both urban and rural settings.",
      choices: ["True", "False"],
      correct: 0 
  },
  {
      question: "What do ducks primarily eat?",
      choices: ["Only grains", "Insects and worms", "Fruits and vegetables", "All of the above"],
      correct: 3 
  },
  {
      question: "What is the primary purpose of a duck's webbed feet?",
      choices: ["To help them swim", "To help them walk on land", "To help them fly", "To help them dig"],
      correct: 0 
  },
  {
      question: "Ducks have waterproof feathers.",
      choices: ["True", "False"],
      correct: 0 
  },
  {
      question: "How many eggs can a duck lay in a year?",
      choices: ["50-200", "10-30", "200-500", "1-10"],
      correct: 0 
  },
  {
      question: "Which of the following is a sign of a healthy duck?",
      choices: ["Bright eyes", "Ruffled feathers", "Lethargy", "Coughing"],
      correct: 0 
  },
  {
      question: "Ducks need a source of water for swimming and cleaning.",
      choices: ["True", "False"],
      correct: 0 
  },
  {
      question: "What is a common cause of stress for ducks?",
      choices: ["Too much sunlight", "Loud noises", "Boredom", "All of the above"],
      correct: 3 
  },
    {
      "question": "What shelter is ideal for pet ducks?",
      "choices": ["Birdcage", "Doghouse", "Coop", "Aquarium"],
      "correct": 2
  },
  {
      "question": "How often should ducks' water be refreshed?",
      "choices": ["Daily", "Twice a week", "Every few days", "Multiple times a day"],
      "correct": 3
  },
  {
      "question": "What bedding is best for ducks?",
      "choices": ["Shavings", "Newspaper", "Sand", "Straw"],
      "correct": 3
  },
  {
      "question": "How do you spot a dehydrated duck?",
      "choices": ["Panting", "Bright feathers", "Clear eyes", "More appetite"],
      "correct": 0
  },
  {
      "question": "How should you introduce new ducks?",
      "choices": ["Immediately", "Slowly", "Separate cages", "Let them fight"],
      "correct": 1
  },
  {
      "question": "How much space does a duck need?",
      "choices": ["1 sq ft", "2-4 sq ft", "5-10 sq ft", "20+ sq ft"],
      "correct": 2
  },
  {
      "question": "Why trim ducks' nails?",
      "choices": ["Prevent injuries", "Swim faster", "Look better", "Stop digging"],
      "correct": 0
  },
  {
      "question": "What food should ducks avoid?",
      "choices": ["Lettuce", "Corn", "Bread", "Peas"],
      "correct": 2
  },
  {
      "question": "How to protect ducks from predators?",
      "choices": ["Outside at night", "Coop", "Free roam", "Keep a dog"],
      "correct": 1
  },
  {
      "question": "How do ducks show happiness?",
      "choices": ["Loud quacks", "Preening", "Hiding", "Not eating"],
      "correct": 1
  },
  {
    "question": "What shelter is ideal for pet ducks?",
    "choices": ["Birdcage", "Doghouse", "Coop", "Aquarium"],
    "correct": 2
  },
  {
    "question": "How often should ducks' water be refreshed?",
    "choices": ["Daily", "Twice a week", "Every few days", "Multiple times a day"],
    "correct": 3
  },
  {
    "question": "What bedding is best for ducks?",
    "choices": ["Shavings", "Newspaper", "Sand", "Straw"],
    "correct": 3
  },
  {
    "question": "How do you spot a dehydrated duck?",
    "choices": ["Panting", "Bright feathers", "Clear eyes", "More appetite"],
    "correct": 0
  },
  {
    "question": "How should you introduce new ducks?",
    "choices": ["Immediately", "Slowly", "Separate cages", "Let them fight"],
    "correct": 1
  },
  {
    "question": "How much space does a duck need?",
    "choices": ["1 sq ft", "2-4 sq ft", "5-10 sq ft", "20+ sq ft"],
    "correct": 2
  },
  {
    "question": "Why trim ducks' nails?",
    "choices": ["Prevent injuries", "Swim faster", "Look better", "Stop digging"],
    "correct": 0
  },
  {
    "question": "What food should ducks avoid?",
    "choices": ["Lettuce", "Corn", "Bread", "Peas"],
    "correct": 2
  },
  {
    "question": "How to protect ducks from predators?",
    "choices": ["Outside at night", "Coop", "Free roam", "Keep a dog"],
    "correct": 1
  },
  {
    "question": "How do ducks show happiness?",
    "choices": ["Loud quacks", "Preening", "Hiding", "Not eating"],
    "correct": 1
  }
];

const numberOfQuestions = duckQuizData.length;
let curQuestionNumber = 0;
let end = false;
let timeAlive=0 ;

io.emit('newQuestionData', curQuestionNumber, duckQuizData[(curQuestionNumber)%numberOfQuestions]);
io.emit('updateHp', duckHp);
//every x ms, the duck loses some hp
//i now have a method to update the duck hp by any amount
setInterval(() => {
  if(!end)
  {
    duckHp = duckHp - 1;
    io.emit('updateHp', duckHp);
    if(duckHp<=0)
      {
        let endDate = new Date();
        let diff = endDate-startDate;
        timeAlive = Math.floor(diff / (1000));
        io.emit('gameOver', timeAlive);
      } 
  }

}, 5000);

//every 5 seconds, send out the new question data
//the current question number will be tracked. all user entries will be compared with the answer to
//the current question number
setInterval(() => {
  //if game is not over, send out questions
  if(!end)
  {
    curQuestionNumber++;
    io.emit('newQuestionData',curQuestionNumber, duckQuizData[(curQuestionNumber)%numberOfQuestions]);
    console.log('sent out new question! question#: ', curQuestionNumber);
  }
}, 10000);


app.get('/', (req, res) => {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
  });
  
// Listen for connections
io.on('connection', (socket) => {
  console.log('a user connected');
  if(end)
  {
    socket.emit('gameOver', timeAlive);
  }
  //on conection, sync questions and ducky state to all users
  socket.emit('newQuestionData', curQuestionNumber, duckQuizData[(curQuestionNumber)%numberOfQuestions]);
  socket.emit('updateHp', duckHp);

  socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
  //when user answers question, check if its right and update ducky state
  socket.on('userAnswer', (username, isCorrect) =>
  {
    //if the game is not over, send updates
    if(!end)
    {
      //decision based on correctness
      let answerResult = '✅';
      if(!isCorrect) answerResult='❌';
      if(isCorrect) duckHp++;
      if(!isCorrect) duckHp-=5;

      //update hp
      io.emit('updateHp', duckHp);
      console.log(username,'answered ', answerResult);
      //send res back to clients
      io.emit('userAnswer', username, isCorrect);
      //if ducky dies, send update and make the game over.
      if(duckHp<=0)
        {
          let endDate = new Date();
          let diff = endDate-startDate;
          timeAlive = Math.floor(diff / (1000));
          end=true;
          io.emit('gameOver', timeAlive);
        } 
    }
    else{
      io.emit('gameOver', timeAlive);
    }
  })

});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});