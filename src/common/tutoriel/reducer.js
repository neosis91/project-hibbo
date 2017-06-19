/**
 * Created by Fakebounce on 13/11/2016.
 */

import * as actions from './actions';
import * as appActions from '../app/actions';
import Tutoriel from './tutoriel.js';
import { Map } from 'immutable';
import { Record } from '../transit';
import { Seq } from 'immutable';
import { firebaseActions } from '../lib/redux-firebase';
import firebase  from '../lib/redux-firebase/firebase';

const State = Record({
    tuto: Map(),
    loaded: false,
    viewer: false
}, 'tutoriel');

const tutorielReducer = (state = new State(), action) => {

    switch (action.type) {

        case firebaseActions.FIREBASE_SAVE_USER_SUCCESS: {
            let viewer = state.viewer;
            if(!viewer)
            {
                return state.set('viewer', action.payload);
            }
            else
            {
                return state;
            }
        }

        case actions.RELOAD_TUTOS: {
            const tutoriel = action.payload.tutoriel;
            if(tutoriel && state.viewer)
            {
                return state.update('tuto', map => map.set(state.viewer.id,tutoriel[state.viewer.id]));
            }
            return state;
        }

        case actions.LOAD_TUTO_SUCCESS: {
            if(state.viewer && action.payload)
            {
                return state.update('tuto', map => map.set(state.viewer.id,action.payload));
            }
            return state;
        }

        case actions.CREATE_TUTO_SUCCESS:
        {
            if(state.viewer)
            {
                return state.update('tuto', map => map.set(action.payload.user.id,action.payload));
            }
            return state;
        }

        case actions.LOAD_STEP_SUCCESS: {
            if(state.viewer)
            {
                return state.update('tuto', map => map.set(action.payload.user.id,action.payload));
            }
            return state;
        }

        default:
            return state;
    }
};

export default tutorielReducer;
