import fromPairs from 'lodash/fromPairs';
import camelCase from 'lodash/camelCase';
import createAction from './createAction';

export default ({
  prefix,
  types,
}) => {
  if (!prefix) {
    throw new Error('prefix is mandatory');
  }

  if (types.map(type => /^([A-Z]+_)*[A-Z]+$/.test(type)).some(ok => !ok)) {
    throw new Error('Only uppercase letters and underscore allowed as action types');
  }

  return fromPairs(types.map(type => [
    camelCase(type),
    createAction(`${prefix}_${type}`),
  ]));
};
