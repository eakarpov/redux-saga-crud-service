import HTTP from './HTTP';
import sagaService from './sagaService';
import createActions from './createActions';
import { list, elem, error} from './serviceReducer';
import serviceActions from './actions';

export default {
  serviceActions,
  HTTP,
  sagaService,
  list,
  elem,
  error,
  createActions,
}
