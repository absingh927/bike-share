export type StationInfoState = {
    stations: Station[];
    statuses: StationStatus[];
    statusLastUpdated: number;
    userLocationState: CallStates;
    stationInfoState: CallStates;
    stationStatusAPIState: CallStates;
    userLocation: userLocation;
    statusTTL: number;
};

export const Loading = 'loading';
export const Success = 'success';
export const Error = 'error';

export type CallStates = typeof Loading | typeof Success | typeof Error;

export type Station = {
    station_id: number;
    name: string;
    lat: number;
    lon: number;
    lastUpdated: Date;
    capacity: number;
};

export type StationStatus = {
    name: string,
    stationID: number;
    num_bikes_available: number;
    num_docks_available: number;
};

export type StationStatusPayload = {
    stations: StationStatus[];
    lastUpdated: number;
    statusTTL: number;
};

export type userLocation = {
    userLat: number,
    userLong: number
};

export type Action<T> = {
    type: string;
    payload: T;
};

