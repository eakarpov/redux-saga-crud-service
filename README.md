# redux-saga-crud-service

Generating crud methods for service using saga middleware.

If you have a CRUD service on the backend, you can use this module to have a quick start with connecting to the service.

## Prerequisites

* react 15+
* redux
* redux-saga

## Installation

```
npm i --save redux-saga-crud-service
```

## Configuration

If you want to configure a location of the service you work with, call a HTTP function in your index.js file

```
import { HTTP } from 'redux-saga-crud-service';

HTTP({
  protocol: 'http',
  port: 8080,
  hostname: 'localhost',
});
```
To connect your application to the service, you should connect it by the redux-saga-crud service.

1. In your root saga for each service you want to connect, call a function:

```
import { all } from 'redux-saga/effects';
import { sagaService } from 'redux-saga-crud-service';

export default function* () {
  yield all([
    ...
    sagaService('yourServiceName', Actions),
    ...
  ]);
}
```

where Actions is your Action creator object.

2. In your root reducer create any of the following reducers for every service you are connecting to:

```
import { combineReducers } from 'redux';
import Actions from '/path/to/Actions';
import { list, elem, error } from 'redux-saga-crud-service';

export default combineReducers({
  yourReducerName1: list('yourServiceName', Actions),
  yourReducerName2: elem('yourServiceName', Actions),
  yourReducerName3: error(['yourServiceName'], Actions),
});
```
error reducer is the single one to the whole root reducer.

Reducer names pattern: let your service is called: "todos".
* yourReducerName1 - todos 
* yourReducerName2 - todo
* yourReducerName3 - error

3. Add to your action creator object a block describing actions of your service:

```
import { createActions, serviceActions } from 'redux-saga-crud-service';

export default {
  yourServiceName: createActions({
    prefix: 'yourServicePrefix',
    types: [...serviceActions],
  }),
}
```
## Using

Now you can simply call actions to manage data from your backend service:

```
...
// somewhere in the class
this.props.getTodos();
...

// in the container action binder
const mapDispatchToProps = {
  getTodos: Actions.todos.list,
};
```
## API

You can manage what form should data have to be stored in your redux state.

- Actions[service].add:
    - data: Any // Data to add
    - setter: (a: Any) => b: Any // Shaping data from user input
- Actions[service].list:
    - getter: (a: Any) => b: Any // Shaping data from backend
- Actions[service].get:
    - data: Any // Data to get
    - getter: (a: Any) => b: Any // Shaping data from backend
- Actions[service].remove:
    - data: Any // Data to remove
    - criteria: (a: Any, b: Any) => Boolean // Filtration for Array.prototype.find function
- Actions[service].update:
    - data: Any // Data to update
    - source: Any // Data before update
    - criteria: (a: Any, b: Any) => Boolean // Filtration for Array.prototype.find function
    - getter: (a: Any) => b: Any // Shaping data from backend
    - setter: (a: Any) => b: Any // Shaping data from user input
    - isList: Boolean (default: false) // Use ```list``` or ```elem``` reducer
    - comparator: (a: Any, b: Any) => Boolean // Comparator to check equality of elements in reducer after update

## License

MIT
