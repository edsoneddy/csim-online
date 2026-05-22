import { createStore } from "redux";
import menuReducer from "./menuReducer";
const store = createStore(
  menuReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;