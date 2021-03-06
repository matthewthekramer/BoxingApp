import {
  DECREMENT_SEC,
  SET_ROUND_SECONDS,
  SET_ROUND_MINUTES,
  SET_REST_SECONDS,
  SET_REST_MINUTES,
  PAUSE_TIMER,
  PLAY_TIMER,
  RESET_TIMER,
  TOGGLE_EDITABLE,
  TOGGLE_EDIT_TYPE,
} from '../actions/types';

const INITIAL_STATE = {
  curSeconds: 15, //seconds remaining until the round/rest period is over
  curMinutes: 0, //minutes remaining until the round/rest period is over
  paused: true,
  resting: false, //if currently during the rest time
  warning: false, //if small time remaining during work period
  roundCount: 1, //keeps track of number of work rounds completed
  initialized: true, //this is true when timer hasn't been started for a given round time
  editable: false, //if user can edit the timer
  editingRound: false, //if user is editing the round time
  editingRest: false, //if user is editing the rest time

  roundTime: {
    minutes: 0,
    seconds: 15,
  },
  restTime: {
    minutes: 0,
    seconds: 10,
  },
};

//return value will be in the range [0 59]
const validateSeconds = (seconds) => {
  if (seconds > 59) {
    return 59;
  } else if (seconds < 0) {
    return 0;
  }
  return seconds;
};

//return value will be be in the range [0 99]
const validateMinutes = (minutes) => {
  if (minutes > 99) {
    return 99;
  } else if (minutes < 0) {
    return 0;
  }
  return minutes;
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    /*
     * Decrements the current time by 1 second, sets warning if 30s remaining in work period
     * if timer goes to 0, starts new rest/work period, alternatiting rest/work periods
    */
    case DECREMENT_SEC: {
      if (parseInt(state.curSeconds, 10) === 0 || state.curSeconds === '') {
        //convert a minute into 60 seconds if there are minutes remaining
        if (parseInt(state.curMinutes, 10) !== 0 || state.curMinutes === '') {
          return { ...state, curSeconds: 59, curMinutes: state.curMinutes - 1 };
        }
        //out of time
        //if the period that just ran out was a rest period
        if (state.resting) {
          return {
            ...state,
            curSeconds: state.roundTime.seconds,
            curMinutes: state.roundTime.minutes,
            resting: false,
          };
        }
        //if the period that just ran out was a work period
        return {
          ...state,
          curSeconds: state.restTime.seconds,
          curMinutes: state.restTime.minutes,
          resting: true,
          warning: false,
          roundCount: state.roundCount + 1,
        };
      //if we should set warning
    } else if (!state.resting && state.curSeconds + (state.curMinutes * 60) <= 30) {
        return {
          ...state,
          curSeconds: state.curSeconds - 1,
          warning: true,
       };
      }
      //if not out of time, just decrement normally
      return { ...state, curSeconds: state.curSeconds - 1 };
    }

    /* sets the amount of seconds for the work period
     * resets the current time to the new round time
     * payload:
     *  seconds - amount of seconds to set rest period to
    */
    case SET_ROUND_SECONDS: {
      if (action.payload.seconds === '') {
        return {
          ...state,
          done: false,
          curMinutes: state.roundTime.minutes,
          curSeconds: '',
          roundCount: 1,
          initialized: true,
          roundTime: {
            ...state.roundTime,
            seconds: '',
          }

        };
      }
      let seconds = parseInt(action.payload.seconds, 10);
      if (isNaN(seconds)) {
        seconds = state.curSeconds;
      } else {
        seconds = validateSeconds(seconds);
      }
      return {
        ...state,
        done: false,
        curMinutes: state.roundTime.minutes,
        curSeconds: seconds,
        roundCount: 1,
        initialized: true,
        roundTime: {
          ...state.roundTime,
          seconds,
        }
      };
    }
    /* sets the amount of minutes for the work period
     * resets the current time to the new round time
     * payload:
     *  minutes - amount of minutes to set rest period to
    */
    case SET_ROUND_MINUTES: {
      if (action.payload.minutes === '') {
        return {
          ...state,
          done: false,
          curMinutes: '',
          curSeconds: state.roundTime.seconds,
          roundCount: 1,
          initialized: true,
          roundTime: {
            ...state.roundTime,
            minutes: '',
          }
        };
      }
      let minutes = parseInt(action.payload.minutes, 10);
      if (isNaN(minutes)) {
        minutes = state.curMinutes;
      } else {
        minutes = validateMinutes(minutes);
      }
      return {
        ...state,
        done: false,
        curMinutes: minutes,
        curSeconds: state.roundTime.seconds,
        roundCount: 1,
        initialized: true,
        roundTime: {
          ...state.roundTime,
          minutes,
        }
      };
    }
    /* sets the amount of seconds for the rest period
     * resets the current time to the round time
     * payload:
     *  seconds - amount of seconds to set rest period to
    */
    case SET_REST_SECONDS: {
      if (action.payload.seconds === '') {
        return {
          ...state,
          curMinutes: state.roundTime.minutes,
          curSeconds: state.roundTime.seconds,
          done: false,
          roundCount: 1,
          initialized: true,
          restTime: {
            ...state.restTime,
            seconds: ''
          }
        };
      }
      let seconds = parseInt(action.payload.seconds, 10);
      if (isNaN(seconds)) {
        seconds = state.curSeconds;
      } else {
        seconds = validateSeconds(seconds);
      }
      return {
        ...state,
        curMinutes: state.roundTime.minutes,
        curSeconds: state.roundTime.seconds,
        resting: false,
        warning: false,
        roundCount: 1,
        initialized: true,
        restTime: {
          ...state.restTime,
          seconds,
        }
      };
    }
    /* sets the amount of minutes for the rest period
     * resets the current time to the round time
     * payload:
     *  minutes - amount of minutes to set rest period to
    */
    case SET_REST_MINUTES: {
      if (action.payload.minutes === '') {
        return {
          ...state,
          curMinutes: state.roundTime.minutes,
          curSeconds: state.roundTime.seconds,
          done: false,
          roundCount: 1,
          initialized: true,
          restTime: {
            ...state.restTime,
            minutes: ''
          }
        };
      }
      let minutes = parseInt(action.payload.minutes, 10);
      if (isNaN(minutes)) {
        minutes = state.curMinutes;
      } else {
        minutes = validateMinutes(minutes);
      }
      return {
        ...state,
        curMinutes: state.roundTime.minutes,
        curSeconds: state.roundTime.seconds,
        resting: false,
        warning: false,
        roundCount: 1,
        initialized: true,
        restTime: {
          ...state.restTime,
          minutes,
        }
      };
    }
    //unpauses timer
    case PLAY_TIMER: {
      return {
        ...state,
        initialized: false,
        paused: false,
      };
    }
    //pauses the timer
    case PAUSE_TIMER: {
      return { ...state, paused: true };
    }
    case RESET_TIMER: {
      return {
        ...state,
        resting: false,
        paused: true,
        roundCount: 1,
        curMinutes: state.roundTime.minutes,
        curSeconds: state.roundTime.seconds,
        warning: false,
        initialized: true,
      };
    }
    /*
     * also sets both edit types to false if toggling to false
     * sets editingRound to true if toggling to true
     */
    case TOGGLE_EDITABLE: {
      if (state.editable) {
        return {
          ...state,
          editable: !state.editable,
          editingRound: false,
          editingRest: false,
        };
      }
      return {
        ...state,
        editable: !state.editable,
        editingRound: true,
        editingRest: false,
      };
    }
    case TOGGLE_EDIT_TYPE: {
      return {
        ...state,
        editingRound: !state.editingRound,
        editingRest: !state.editingRest,
      };
    }
    default:
      return state;
  }
};
