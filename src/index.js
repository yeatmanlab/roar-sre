import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';
import 'jspsych/css/jspsych.css';
import blueImg from './img/blue.png';
import orangeImg from './img/orange.png';
import { RoarFirekit } from '@bdelab/roar-firekit';
import { roarConfig } from './roarConfig';
import 'regenerator-runtime/runtime';

/* create timeline */
const timeline = [];

const queryString = new URL(window.location).search;
const urlParams = new URLSearchParams(queryString);
const participant = urlParams.get('participant') || 'example-participant';
const minimalUserInfo = { id: participant };

const taskInfo = {
  taskId: 'rt',
  taskName: 'Example Reaction Time',
  variantName: 'From Pavlovia Docs',
  taskDescription:
    'This is the example reaction time task from the pavlovia docs.',
  variantDescription: 'Default',
  blocks: [
    {
      blockNumber: 1,
      trialMethod: 'random-without-replacement',
      corpus: ['blue', 'orange'],
    },
  ],
};

const firekit = new RoarFirekit({
  userInfo: minimalUserInfo,
  taskInfo,
  config: roarConfig,
});

await firekit.startRun();

const jsPsych = initJsPsych({
  on_data_update: function (data) {
    console.log('In data update');
    console.log(data);
    if (data.saveToFirestore) {
      firekit.writeTrial(data);
    }
  },
  on_finish: async (data) => {
    await firekit.finishRun();
    jsPsych.data.displayData();
  },
});

/* define welcome message trial */
const welcome = {
  type: htmlKeyboardResponse,
  stimulus: 'Welcome to the experiment. Press any key to begin.',
};
timeline.push(welcome);

/* define instructions trial */
const instructions = {
  type: htmlKeyboardResponse,
  stimulus:
    '<p>In this experiment, a circle will appear in the center ' +
    'of the screen.</p><p>If the circle is <strong>blue</strong>, ' +
    'press the letter F on the keyboard as fast as you can.</p>' +
    '<p>If the circle is <strong>orange</strong>, press the letter J ' +
    'as fast as you can.</p>' +
    "<div style='width: 700px;'>" +
    `<div style='float: left;'><img src='${blueImg}'/>` +
    "<p class='small'><strong>Press the F key</strong></p></div>" +
    `<div class='float: right;'><img src='${orangeImg}'/>` +
    "<p class='small'><strong>Press the J key</strong></p></div>" +
    '</div>' +
    '<p>Press any key to begin.</p>',
  post_trial_gap: 2000,
};
timeline.push(instructions);

/* test trials */
const test_stimuli = [
  {
    stimulus: blueImg,
    data: { test_part: 'test', correct_response: 'f' },
  },
  {
    stimulus: orangeImg,
    data: { test_part: 'test', correct_response: 'j' },
  },
];

const fixation = {
  type: htmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: 'NO_KEYS',
  trial_duration: function () {
    return jsPsych.randomization.sampleWithoutReplacement(
      [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
      1
    )[0];
  },
  data: { test_part: 'fixation' },
};

const test = {
  type: imageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['f', 'j'],
  data: jsPsych.timelineVariable('data'),
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response
    );
    data.saveToFirestore = true;
  },
};

const test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true,
};
timeline.push(test_procedure);

/* define debrief */
const debrief_block = {
  type: htmlKeyboardResponse,
  stimulus: function () {
    var trials = jsPsych.data.get().filter({ test_part: 'test' });
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round((correct_trials.count() / trials.count()) * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return (
      '<p>You responded correctly on ' +
      accuracy +
      '% of the trials.</p>' +
      '<p>Your average response time was ' +
      rt +
      'ms.</p>' +
      '<p>Press any key to complete the experiment. Thank you!</p>'
    );
  },
};
timeline.push(debrief_block);

/* start the experiment */
jsPsych.run(timeline);
