import HTTP from './src/HTTP';
import sagaService from './src/sagaService';
import createActions from './src/createActions';
import { list, elem, error} from './src/serviceReducer';
import serviceActions from './src/actions';

export default {
  serviceActions,
  HTTP,
  sagaService,
  list,
  elem,
  error,
  createActions,
}
