import { StationInfoState, Loading } from '../types';

export const REQUESTING_USER_LOCATION = 'REQUESTING_USER_LOCATION';
export const SUCCESS_USER_LOCATION = 'SUCCESS_USER_LOCATION';
export const PERMISSION_DENIED_USER_LOCATION = 'PERMISSSION_DENIED_USER_LOCATION';

// Get station information
export const REQUESTING_STATION_INFO = 'REQUESTING_STATION_INFO';
export const SUCCESS_STATION_INFO = 'SUCCESS_STATION_INFO';
export const ERROR_STATION = 'ERROR_STATION';

// Get station status
export const REQUESTING_STATION_STATUS = 'REQUESTING_STATION_STATUS';
export const SUCCESS_STATION_STATUS = 'SUCCESS_STATION_STATUS';
export const ERROR_STATUSES = 'ERROR_STATUSES';

export const defaultState: StationInfoState = {
    stations: [],
    statuses: [],
    statusLastUpdated: 0,
    userLocationState: Loading,
    stationInfoState: Loading,
    stationStatusAPIState: Loading,    
    userLocation: {
        userLat: 0,
        userLong: 0
    },
    statusTTL: 0
};   

export const STATION_INFO_URL = 'https://gbfs.bluebikes.com/gbfs/en/station_information.json';
export const STATION_STATUS_URL = 'https://gbfs.bluebikes.com/gbfs/en/station_status.json';