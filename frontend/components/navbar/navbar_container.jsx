import { connect } from 'react-redux';

import { signin, signout } from '../../actions/session_actions';
import { toggleSideMenu } from '../../actions/ui_actions';
import NavBar from './navbar';

const mapStateToProps = (state) => ({
    currentUser: state.entities.users[state.session.currentUser]
});

const mapDispatchToProps = (dispatch) => ({
    signout: () => dispatch(signout()),
    toggleSideMenu: () => dispatch(toggleSideMenu())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);