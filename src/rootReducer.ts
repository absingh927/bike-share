import { combineReducers } from 'redux';
import { stations } from './Stations/stationsReducer';

export const rootReducer = combineReducers({
  stations
} as any);