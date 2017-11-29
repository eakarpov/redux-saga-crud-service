import { call, put, takeEvery } from 'redux-saga/effects';
import HTTP from './HTTP';
import worker from './worker';

export default function* (service, Actions) {
  const add = worker(function* ({ payload: { data, setter } }) {
    try {
      const elem = yield call(
        HTTP().post,
        `/${service}`,
        data,
      );
      const setFunction = setter || function (a) { return a; };
      yield put(Actions[service].added(setFunction(elem)));
    } catch (e) {
      yield put(Actions[service].addFail({ error: e }));
      yield put(Actions[service].errorRaise({ type: service, message: e.message }));
    }
  });

  const list = worker(function* ({ payload }) {
    try {
      const res = yield call(
        HTTP().get,
        `/${service}`,
      );
      const getFunction = (payload && payload.getter) || function (a) { return a; };
      yield put(Actions[service].listed(getFunction(res.data)));
    } catch (e) {
      yield put(Actions[service].listFail({ error: e }));
      yield put(Actions[service].errorRaise({ type: service, message: e.message }));
    }
  });

  const get = worker(function* ({ payload: { data, getter } }) {
    try {
      const res = yield call(
        HTTP().get,
        `/${service}/${data}`,
      );
      const getFunction = getter || function (a) { return a; };
      yield put(Actions[service].got(getFunction(res)));
    } catch (e) {
      yield put(Actions[service].getFail({ error: e }));
      yield put(Actions[service].errorRaise({ type: service, message: e.message }));
    }
  });

  const update = worker(function* ({
    payload: {
      data, source, criteria, getter, setter, isList = false, comparator,
    },
  }) {
    try {
      const toBeUpdated = yield call(
        HTTP().get,
        `/${service}`,
      );
      const elem = yield Promise
        .resolve()
        .then(() => {
          const criterion = criteria || function (a, b) { return a === b; };
          return toBeUpdated.data.find(el => criterion(el, { data, source }));
        });
      yield Promise.resolve().then(() => Object.keys(data).forEach(el => elem[el] = data[el]));
      const res = yield call(
        HTTP().put,
        `/${service}/${elem._id}`,
        elem,
      );
      if (isList) {
        yield put(Actions[service].updated({
          from: (setter || function (a) {
            return a;
          })(source),
          to: (getter || function (a) {
            return a;
          })(res),
          comparator,
        }));
      } else {
        yield put(Actions[service].updatedOne((getter || function (a) {
          return a;
        })(res)));
      }
    } catch (e) {
      if (list) {
        yield put(Actions[service].updateFail({ error: e }));
      } else {
        yield put(Actions[service].updateOneFail({ error: e }));
        yield put(Actions[service].errorRaise({ type: service, message: e.message }));
      }
    }
  });

  const remove = worker(function* ({ payload: { data, criteria } }) {
    try {
      const toBeDeleted = yield call(
        HTTP().get,
        `/${service}`,
      );
      const elem = yield Promise
        .resolve()
        .then(() => {
          const criterion = criteria || function (a, b) { return a === b; };
          return toBeDeleted.data.find(el => criterion(el, data));
        });
      yield call(
        HTTP().delete,
        `/${service}/${elem._id}`,
      );
      yield put(Actions[service].removed(data));
    } catch (e) {
      yield put(Actions[service].removeFail({ error: e }));
      yield put(Actions[service].errorRaise({ type: service, message: e.message }));
    }
  });

  yield takeEvery(Actions[service].add.type, add);
  yield takeEvery(Actions[service].list.type, list);
  yield takeEvery(Actions[service].remove.type, remove);
  yield takeEvery(Actions[service].get.type, get);
  yield takeEvery(Actions[service].update.type, update);
}
