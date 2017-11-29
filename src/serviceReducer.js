export const list = (service, Actions) => (store = [], action) => {
  switch (action.type) {
    case Actions[service].added.type: {
      return [
        ...store,
        action.payload,
      ];
    }
    case Actions[service].addFail.type: {
      return store;
    }
    case Actions[service].listed.type: {
      return action.payload;
    }
    case Actions[service].listFail.type: {
      return store;
    }
    case Actions[service].removed.type: {
      const index = store.indexOf(action.payload);
      return store.length > 1 ? [
        ...store.slice(0, index),
        ...store.slice(index + 1),
      ] : [];
    }
    case Actions[service].removeFail.type: {
      return store;
    }
    case Actions[service].updated.type: {
      const elem = store.find(el => action.payload.comparator(el, action.payload.from));
      let index = -1;
      store.forEach((el, i) => {
        if (action.payload.comparator(el, action.payload.from)) index = i;
      });
      return elem ? [
        ...store.slice(0, index),
        action.payload.to,
        ...store.slice(index + 1),
      ] : store;
    }
    case Actions[service].updateFail.type: {
      return store;
    }
    default:
      return store;
  }
};

export const elem = (service, Actions) => (store = {}, action) => {
  switch (action.type) {
    case Actions[service].got.type: {
      return action.payload;
    }
    case Actions[service].getFail.type: {
      return {};
    }
    case Actions[service].updatedOne.type: {
      return action.payload;
    }
    case Actions[service].updateOneFail.type: {
      return {};
    }
    default: return store;
  }
};

// eslint-disable-next-line no-unused-vars
export const error = (services, Actions) => (store = {}, action) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const service of services) {
    if (Actions[service] && Actions[service].errorRaise) {
      if (action.type === Actions[service].errorRaise.type) {
        return {
          service: action.payload.type,
          message: action.payload.message,
        };
      }
    }
    if (Actions[service] && Actions[service].errorDrop) {
      return {};
    }
  }
  return {};
};
