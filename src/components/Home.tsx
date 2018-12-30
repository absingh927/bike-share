import * as React from 'react';
import { connect } from 'react-redux';
import { Station, userLocation } from '../types';
import { AppState } from 'src/AppState';
import {
  Navbar, NavbarBrand, Button, Row, Col, Card, CardBody,
  CardTitle, CardSubtitle, Container
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { orderBy } from 'lodash-es';
import { Link } from 'react-router-dom';
import { getStationStatus } from '../Stations/StationActions';

type HomeStateProps = {
  stations: Station[];
  userLocation: userLocation;
};

const mapDispatchToProps = {
  getStationStatus
};

type HomeProps = HomeStateProps & typeof mapDispatchToProps;

const mapStateToProps = (store: AppState, ownProps?: HomeStateProps): HomeStateProps => {
  if (!store || !ownProps) {
    throw new Error('Not available');
  }
  return {
    stations: store.stations.stations,
    userLocation: store.stations.userLocation
  };
};

type HomeState = {
  stationsInfo: Station[];
  filterByCapacity: boolean;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    // Add distance between user location and each station
    const stationsWithDistance = props.stations.map(station => {
      const distance = this.getDistance(props.userLocation.userLat, props.userLocation.userLong, station.lat, station.lon, 'K');
      return {
        ...station,
        distance
      };
    });
    // Sort results by location for default view. Grab first 10.
    const nearestStations = orderBy(stationsWithDistance, 'distance', 'asc').slice(0,10);

    this.state = {
      // stationsInfo: props.stations,
      filterByCapacity: false,
      stationsInfo: nearestStations
    };
  }

  public render() {
    return (
      <>
        {this.renderSubNav()}
        <Container>
          <Row>
            <Col xs='12'> 
              {this.renderStation(this.state.stationsInfo)}
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  private renderSubNav = () => {
    return (
      <Navbar color='light' light expand='sm' className='border-bottom sticky-top'>
        <NavbarBrand>Bike Stations</NavbarBrand>
        <Button outline color='info' className='ml-auto' onClick={this.handleFilterBtnClick}>
          Filter by {this.state.filterByCapacity ? 'Location' : 'Capacity'}
        </Button>
      </Navbar>
    );
  }

  private handleFilterBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      filterByCapacity: !this.state.filterByCapacity,
      stationsInfo: this.sortStations(!this.state.filterByCapacity, this.state.stationsInfo)
    });
  }

  private renderStation = (stations: Station[]) => {
   return stations.map(station => {
     return (
      <Link to={{pathname: `/stations/${station.station_id}`}} key={station.station_id} className='text-dark'>
        <Card key={station.station_id} className='m-3'>
          <Row>
            <Col xs='10'>
              <CardBody>
                <CardTitle>{station.name}</CardTitle>
                <CardSubtitle>{station.capacity} Bikes</CardSubtitle>
              </CardBody>
            </Col>
            <Col xs='2' className='text-center text-primary mt-4'>
              <FontAwesomeIcon icon={faArrowRight} /> 
            </Col>
          </Row>
        </Card>
      </Link>
     );
   })
  }

  private sortStations = (sortByLocation: boolean, stations: Station[]) => {
    if (sortByLocation) {
      return orderBy(stations,'capacity','desc');
    }
    // default is 'distance'
    return orderBy(stations, 'distance', 'asc');
  }

  /**
   * The Haversine Formula as implemented by https://www.geodatasource.com/developers/javascript
   * Units:
   *  K = Kilometers
   *  M = Miles (default)
   *  N = Natutical Miles
   */
  private getDistance = (userLat: number, userLong: number, locationLat: number, locationLong: number, unit: string) => {
    const radlat1 = Math.PI * userLat / 180;
    const radlat2 = Math.PI * locationLat / 180;
    const theta = userLong - locationLong;
    const radtheta = Math.PI * theta / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    if (dist > 1) {
      dist = 1;
    }

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') { 
      dist = dist * 0.8684; 
    }

    return dist;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
