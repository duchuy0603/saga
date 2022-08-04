import {applyMiddleware, compose, createStore} from 'redux'
import {routerMiddleware} from 'connected-react-router'
import thunk from 'redux-thunk';
import createRootReducer from '../reducers'
import rootSaga from "../sagas/index";
import createSagaMiddleware from 'redux-saga';
import {createBrowserHistory} from 'history';

// Saga dev tool detect
const composeEhancers = process.env.NODE_ENV !== "production" &&
typeof window === "object" &&
window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  shouldHotReoload: false
}) : compose;

export const history = createBrowserHistory();

const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware, routeMiddleware];

export default function configureStore(preloadedState) {
  const enhancers = [
    applyMiddleware(routerMiddleware(history), ...middlewares)
  ];
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    // compose(
    //   applyMiddleware(
    //     routerMiddleware(history), // for dispatching history actions
    //     ...middlewares
    //   ),
    // ),
    composeEhancers(...enhancers)
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
