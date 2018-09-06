import { AUTH_USER, UNAUTH_USER } from '../constants';

export default function reducer(state = { authenticated: false, data : null, token : null }, action) {
  switch (action.type) {
  case AUTH_USER:
    return { ...state, authenticated: true, data :action.payload,  token: action.token};
  case UNAUTH_USER:
    return { ...state, authenticated: false };
  default:
    return state;
  }
}