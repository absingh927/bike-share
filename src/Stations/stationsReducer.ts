import { Action, StationInfoState, Station, StationStatusPayload, Success, Error, Loading } from '../types';
import * as constants from './StationConstants';
import { ReducerMap } from '../helpers';
import { bindActionCreators } from 'redux';

export const handlers: ReducerMap<StationInfoState> = {
  // User location success
  [constants.SUCCESS_USER_LOCATION]: (state: StationInfoState, action:Action<Position>) => {
    return {
      ...state,
      userLocationState: Success,
      userLocation: {
        userLat: action.payload.coords.latitude,
        userLong: action.payload.coords.longitude
      }
    };
  },
  // User location permission denied
  [constants.PERMISSION_DENIED_USER_LOCATION]: (state: StationInfoState) => {
    return {
      ...state,
      userLocationState: Error
    } 
  },
  // user location loading
  [constants.REQUESTING_USER_LOCATION]: (state: StationInfoState) => {
    return {
      ...state,
      userLocationState: Loading
    }
  },
  // station info success
  [constants.SUCCESS_STATION_INFO]: (state: StationInfoState, action:Action<Station[]>) => {
    return {
      ...state,
      stationInfoState: Success,
      stations: action.payload
    }
  },
  // loading station information
  [constants.REQUESTING_STATION_INFO]: (state: StationInfoState) => {
    return {
      ...state,
      stationInfoState: Loading
    }
  },
  // station information error
  [constants.ERROR_STATION]: (state: StationInfoState) => {
    return {
      ...state,
      stationInfoState: Error
    }
  },
  // station statuses success
  [constants.SUCCESS_STATION_STATUS]: (state: StationInfoState, action: Action<StationStatusPayload>) => {
    return {
      ...state,
      stationStatusAPIState: Success,
      statuses: action.payload.stations,
      statusLastUpdated: action.payload.lastUpdated,
      statusTTL: action.payload.statusTTL
    }
  },
  //station statuses loading
  [constants.ERROR_STATUSES]: (state: StationInfoState) => {
    return {
      ...state,
      stationStatusAPIState: Error
    }
  },
  // station statuses error
  [constants.REQUESTING_STATION_STATUS]: (state: StationInfoState) => {
    return {
      ...state,
      stationStatusAPIState: Loading
    }
  }
}

export function stations(state: StationInfoState = constants.defaultState, action: Action<any>) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
