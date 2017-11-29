import { call } from 'redux-saga/effects';

export default saga => function* (action) {
  try {
    yield call(saga, action);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
