import * as constants from './StationConstants';
import { Dispatch } from 'redux';
import axios from 'axios';

export const requestLocation = () => ({
  type: constants.REQUESTING_USER_LOCATION
});

export const getUserLocation = () => (dispatch: Dispatch) => {
  dispatch(requestLocation());

  // call user location api
  const browserLocator = navigator.geolocation;

  const userLocation = new Promise<Position>((resolve, reject) => {
    if (!browserLocator) {
      reject( new Error('Location not supported'));
    }
    browserLocator.getCurrentPosition((position) => {
      resolve(position);
    },() => {
      reject( new Error('Permission Denied'));
    });
  });

  userLocation.then(result => {
    dispatch({
      type: constants.SUCCESS_USER_LOCATION,
      payload: result
    });
  }, err => {
    dispatch ({
      type: constants.PERMISSION_DENIED_USER_LOCATION,
      payload: err
    })
  })
};

export const getStationsInfo = () => (dispatch: Dispatch) => {
  // send loading stations message
  dispatch({ type: constants.REQUESTING_STATION_INFO });

  // make api call
  axios.get(constants.STATION_INFO_URL)
  .then(stations => {
    dispatch({
      type: constants.SUCCESS_STATION_INFO,
      payload: stations.data.data.stations
    });
  })
  .catch(error => {
    console.log(error);
    dispatch({
      type: constants.ERROR_STATION,
      payload: error
    });
  })
};

export const getStationStatus = () => (dispatch: Dispatch) => {
  dispatch({ type: constants.REQUESTING_STATION_STATUS });
  
  axios.get(constants.STATION_STATUS_URL)
  .then(stationsStatuses => {
    dispatch({
      type: constants.SUCCESS_STATION_STATUS,
      payload: {
        stations: stationsStatuses.data.data.stations,
        lastUpdated: stationsStatuses.data.last_updated,
        statusTTL: stationsStatuses.data.ttl
      },
    });
  })
  .catch(error => {
    console.log(error);
    dispatch({
      type: constants.ERROR_STATUSES,
      payoad: error
    });
  })
};
