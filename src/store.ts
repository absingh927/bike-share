import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './rootReducer';


let appliedMiddleware: any = null;
let composeEnhancers : any = null;

if (process.env.NODE_ENV !== 'production') {
  // in production builds this gets compiled out, and the require never
  appliedMiddleware = applyMiddleware(thunk);
  composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  appliedMiddleware = applyMiddleware(thunk);
  composeEnhancers = compose;
}

export const createAppStore = () => {
  const store = createStore(rootReducer, composeEnhancers(appliedMiddleware));
  return store;
};