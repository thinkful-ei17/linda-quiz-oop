'use strict';
/* global $ */

const BASE_API_URL = 'https://opentdb.com';
const TOP_LEVEL_COMPONENTS = [
  'js-intro', 'js-question', 'js-question-feedback', 
  'js-outro', 'js-quiz-status'
];

let QUESTIONS = [];

// token is global because store is reset between quiz games, but token should persist for 
// entire session
const getInitialStore = function(){
  return {
    page: 'intro',
    currentQuestionIndex: null,
    userAnswers: [],
    feedback: null,
    sessionToken,
  };
};

let store = getInitialStore();

// Helper functions
// ===============


class Api {
  constructor() {
    this.sessionToken = null;
  }

  //Private Methods
  //#2 - builds url after token fetch
  _buildTokenUrl() {
    return new URL(this.BASE_API_URL + '/api_token.php');
  }
  
  //Public Methods
  //#1 - fetches token 
  fetchToken(callback) {
    if (this.sessionToken) {
      return callback();
    }

    const url = this._buildTokenUrl();
    url.searchParams.set('command', 'request');

    $.getJSON(url, res => {
      this.sessionToken = res.token;
      callback();
    }, err => console.log(err));
  }

  //#3 - builds url for question retrieval after token fetch and fetch url. 
  //default parameters
  buildBaseUrl(amt = 10, query = {}) {
    if (this.sessionToken) {
      url.searchParams.set('token', this.sessionToken);
    }
    const url = this.BASE_API_URL + '/api.php';
    const queryKeys = Object.keys(query);
    url.searchParams.set('amount', amt);

    queryKeys.forEach(key => url.searchParams.set(key, query[key]));
    return url;
  }

  //#4 - fetches questions
  fetchQuestions(amt, query, callback) {
    $.getJSON(this.buildBaseUrl(amt, query), callback, err => console.log(err.message));
  }

}

Api.prototype.BASE_API_URL = 'https://opentdb.com';
Renderer.prototype.TOP_LEVEL_COMPONENTS = [
  'js-intro', 'js-question', 'js-question-feedback', 
  'js-outro', 'js-quiz-status'
];
class Store {
  constructor() {
  this.feedback = null;
  this.userAnswer
  this.QUESTION //render and template
  }

  getFeedback() {
    return 
  }
}

class Renderer {
  constructor(api) {
    this.api = api; //obtains the question data and keeps it constant throughout rendering?
    this.feedback = null;
    this.page = 'intro';
    currentQuestionIndex
  }

//need a setter for dynamic keys page , no need for getter becuase internal code use

  hideAll() {
    this.TOP_LEVEL_COMPONENTS.forEach(component => $(`.${component}`).hide());
  }

  switchViews() { //any place with render is now Renderer.switchViews
  let html;
  switch (this.page) {
    case 'intro':
      if (api.sessionToken) {
        $('.js-start').attr('disabled', false);
      }
    
      $('.js-intro').show();
      break;
      
    case 'question':
      html = generateQuestionHtml(question);
      $('.js-question').html(html);
      $('.js-question').show();
      $('.quiz-status').show();
      break;
  
    case 'answer':
      html = generateFeedbackHtml(feedback);
      $('.js-question-feedback').html(html);
      $('.js-question-feedback').show();
      $('.quiz-status').show();
      break;
  
    case 'outro':
      $('.js-outro').show();
      $('.quiz-status').show();
      break;
  
    default:
      return;
    }

  } 
  

  const question = getCurrentQuestion();
  const { feedback } = this.feedback; 
  const { current, total } = getProgress();

  $('.js-score').html(`<span>Score: ${getScore()}</span>`);
  $('.js-progress').html(`<span>Question ${current} of ${total}`);

  
  }


const render = function(api) {
  let html;
  hideAll();

  const question = getCurrentQuestion();
  const { feedback } = store; 
  const { current, total } = getProgress();

  $('.js-score').html(`<span>Score: ${getScore()}</span>`);
  $('.js-progress').html(`<span>Question ${current} of ${total}`);

  switch (store.page) {
  case 'intro':
    if (api.sessionToken) {
      $('.js-start').attr('disabled', false);
    }
  
    $('.js-intro').show();
    break;
    
  case 'question':
    html = generateQuestionHtml(question);
    $('.js-question').html(html);
    $('.js-question').show();
    $('.quiz-status').show();
    break;

  case 'answer':
    html = generateFeedbackHtml(feedback);
    $('.js-question-feedback').html(html);
    $('.js-question-feedback').show();
    $('.quiz-status').show();
    break;

  case 'outro':
    $('.js-outro').show();
    $('.quiz-status').show();
    break;

  default:
    return;
  }
};

//=======================



const seedQuestions = function(questions) {
  QUESTIONS.length = 0;
  questions.forEach(q => QUESTIONS.push(createQuestion(q)));
};

const fetchAndSeedQuestions = function(amt, query, callback) {
  fetchQuestions(amt, query, res => {
    seedQuestions(res.results);
    callback();
  });
};

// Decorate API question object into our Quiz App question format
const createQuestion = function(question) {
  // Copy incorrect_answers array into new all answers array
  const answers = [ ...question.incorrect_answers ];

  // Pick random index from total answers length (incorrect_answers length + 1 correct_answer)
  const randomIndex = Math.floor(Math.random() * (question.incorrect_answers.length + 1));

  // Insert correct answer at random place
  answers.splice(randomIndex, 0, question.correct_answer);

  return {
    text: question.question,
    correctAnswer: question.correct_answer,
    answers
  };
};

const getScore = function() {
  return store.userAnswers.reduce((accumulator, userAnswer, index) => {
    const question = getQuestion(index);

    if (question.correctAnswer === userAnswer) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);
};

const getProgress = function() {
  return {
    current: store.currentQuestionIndex + 1,
    total: QUESTIONS.length
  };
};

const getCurrentQuestion = function() {
  return QUESTIONS[store.currentQuestionIndex];
};

const getQuestion = function(index) {
  return QUESTIONS[index];
};

// HTML generator functions
// ========================
const generateAnswerItemHtml = function(answer) {
  return `
    <li class="answer-item">
      <input type="radio" name="answers" value="${answer}" />
      <span class="answer-text">${answer}</span>
    </li>
  `;
};

const generateQuestionHtml = function(question) {
  const answers = question.answers
    .map((answer, index) => generateAnswerItemHtml(answer, index))
    .join('');

  return `
    <form>
      <fieldset>
        <legend class="question-text">${question.text}</legend>
          ${answers}
          <button type="submit">Submit</button>
      </fieldset>
    </form>
  `;
};

const generateFeedbackHtml = function(feedback) {
  return `
    <p>
      ${feedback}
    </p>
    <button class="continue js-continue">Continue</button>
  `;
};

// Render function - uses `store` object to construct entire page every time it's run
// ===============


// Event handler functions
// =======================
const handleStartQuiz = function() {
  store = getInitialStore();
  store.page = 'question';
  store.currentQuestionIndex = 0;
  const quantity = parseInt($('#js-question-quantity').find(':selected').val(), 10);
  fetchAndSeedQuestions(quantity, { type: 'multiple' }, () => {
    render();
  });
};

const handleSubmitAnswer = function(e) {
  e.preventDefault();
  const question = getCurrentQuestion();
  const selected = $('input:checked').val();
  store.userAnswers.push(selected);
  
  if (selected === question.correctAnswer) {
    store.feedback = 'You got it!';
  } else {
    store.feedback = `Too bad! The correct answer was: ${question.correctAnswer}`;
  }

  store.page = 'answer';
  render();
};

const handleNextQuestion = function() {
  if (store.currentQuestionIndex === QUESTIONS.length - 1) {
    store.page = 'outro';
    render();
    return;
  }

  store.currentQuestionIndex++;
  store.page = 'question';
  render();
};

// On DOM Ready, run render() and add event listeners
$(() => {
  // Run first render
  const api = new Api();
  render(api);
  
  // Fetch session token, re-render when complete
  api.fetchToken(() => {
    render(api);
  });

  $('.js-intro, .js-outro').on('click', '.js-start', handleStartQuiz);
  $('.js-question').on('submit', handleSubmitAnswer);
  $('.js-question-feedback').on('click', '.js-continue', handleNextQuestion);
});
