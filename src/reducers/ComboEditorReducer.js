//This reduces handles the state for when a user is creating or updating a combination
//the user can add punches, change the order, create a name, etc
import {
  COMBO_SET_NAME,
  COMBO_ADD_PUNCH,
  COMBO_SWITCH_PUNCH,
  COMBO_SET_SPEED,
  COMBO_SET_PUNCH_NAME,
  COMBO_REMOVE_PUNCH,
  COMBO_CLEAR_EDITOR,
  COMBO_START_EDIT,
} from '../actions/types';

import { types } from '../util/PunchNameToImg';

const INITIAL_STATE = {
  editing: -1, //-1 if adding a new punch, otherwise the index of the punch being edited
  combo: {
    name: 'New Combo',
    punches: [
      {
        name: types[0],
        speed: 3,
      }
    ],
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COMBO_SET_NAME: {
      return { ...state, name: action.payload.name };
    }
    case COMBO_ADD_PUNCH: {
      return {
        ...state,
        combo: {
         ...state.combo,
         punches: state.combo.punches.concat([action.payload.punch])
       }
     };
    }
    //  used to switch the order of two punches
    //payload:
    //  idx1: first index to swap
    // idx2: 2nd index to swap
    case COMBO_SWITCH_PUNCH: {
      const { idx1, idx2 } = action.payload;
      const newPunches = state.combo.punches.slice();
      const tempPunch = newPunches[idx1];
      newPunches[idx1] = newPunches[idx2];
      newPunches[idx2] = tempPunch;
      return { ...state, combo: { ...state.combo, punches: newPunches } };
    }
    /*
     * Sets the name of a punch given the index
     * payload:
     *  idx: index in punches of the punch to update
     *  name: new name for the punch
     */
    case COMBO_SET_PUNCH_NAME: {
      const newPunch = state.combo.punches[action.payload.idx];
      newPunch.name = action.payload.name;
      const newPunches = state.combo.punches.slice();
      newPunches[action.payload.idx] = newPunch;
      return { ...state, combo: { ...state.combo, punches: newPunches } };
    }
    /*
     * sets the speed of a certain punch
     * payload:
     *  idx: index in punches of the punch to update
     *  speed: new speed for the punch
     */
    case COMBO_SET_SPEED: {
      const newPunch = state.combo.punches[action.payload.idx];
      newPunch.speed = action.payload.speed;
      const newPunches = state.combo.punches.slice();
      newPunches[action.payload.idx] = newPunch;
      return { ...state, combo: { ...state.combo, punches: newPunches } };
    }
    /*
     * Removes a punch from the combination
     * payload:
     *  idx: index in punches of the punch to delete
     */
    case COMBO_REMOVE_PUNCH: {
      const newPunches = state.combo.punches.slice(0, action.payload.idx)
        .concat(state.combo.punches.slice(action.payload.idx + 1, state.combo.punches.length));
      return { ...state, combo: { ...state.combo, punches: newPunches } };
    }
    /*
     * Clears editor data by setting state to initial state
     */
    case COMBO_CLEAR_EDITOR: {
      return INITIAL_STATE;
    }
    /*
     * marks punch[idx] as being edited
     * payload:
     *  idx - the index of the punch being edited
     */
    case COMBO_START_EDIT: {
      return {
        ...state,
        editing: action.payload.idx,
        combo: action.payload.combo,
      };
    }
    default:
      return state;
  }
};
