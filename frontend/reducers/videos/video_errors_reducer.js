import { RECEIVE_VIDEO, RECEIVE_VIDEO_ERRORS, CLEAR_ERRORS } from '../../actions/videos_actions';

const videoErrorsReducer = (state = [], action) => {
    Object.freeze(state);
    
    switch (action.type) {
        case RECEIVE_VIDEO:
            return [];
        case RECEIVE_VIDEO_ERRORS:
            return [action.errors.responseJSON];
        case CLEAR_ERRORS:
            return [];
        default:
            return state;
    }
};

export default videoErrorsReducer;