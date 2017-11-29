export default (type) => {
  if (typeof type !== 'string') throw new Error('Action type is not a string');
  const action = (payload) => {
    if (payload !== undefined) return { type, payload };
    return { type };
  };
  action.type = type;
  return action;
};
