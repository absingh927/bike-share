import * as React from 'react';
import { AppState } from './AppState';
import { connect } from 'react-redux';
import { getUserLocation, getStationsInfo, getStationStatus } from './Stations/StationActions';
import './index.css';
import Home  from './components/Home';
import { Navbar, NavbarBrand, Container, Row, Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBicycle, faSpinner, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom'; 
import { BikeDetailsComponent } from './components/BikeDetails';
import { CallStates, Loading, Error, Success } from './types';

type AppComponent = typeof mapDispatchToProps & AppComponentMapState & RouteComponentProps;

type AppComponentMapState = {
  userLocationState: CallStates;
  stationInfoState: CallStates;
};

const mapDispatchToProps = {
  getUserLocation,
  getStationsInfo,
  getStationStatus
};

const mapStateToProps = (store: AppState): AppComponentMapState => ({
  userLocationState: store.stations.userLocationState,
  stationInfoState: store.stations.stationInfoState
});

class App extends React.PureComponent<AppComponent> {
  public componentDidMount() {
    this.props.getUserLocation();
  }

  public render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderUserLocation(this.props.userLocationState)}
        {this.renderStationInfo(this.props.stationInfoState, this.props.userLocationState)} 
      </>
    );
  }
  
  private renderHeader = () => {
    return (
      <Navbar color='success' expand='sm' className='text-light'>
        <NavbarBrand>
          <FontAwesomeIcon icon={faBicycle}/> Toronto Bike Share
        </NavbarBrand>
      </Navbar>
    );
  }

  private renderUserLocation = (userLocationLoading: CallStates) => {
    switch (userLocationLoading) {
      case Loading:
        return (
          <Container>
            <Row>
              <Col className='text-center mt-5'>
                <FontAwesomeIcon icon={faLocationArrow}/>
                <h2>Loading your location</h2>
              </Col>
            </Row>
          </Container>
        );
      case Error:
        return (
          <Container>
            <Row>
              <Col className='text-center mt-5'>
                <h2>Location Permission Denied. We can't do much without your location. Please refresh and allow location permissions.</h2>
              </Col>
            </Row>
          </Container>
        );
      default:
        return null;
    }
  }

  private renderStationInfo = (stationInfoLoading: CallStates, userLocationLoading: CallStates ) => {
    if (stationInfoLoading === Loading && userLocationLoading === Success) {
      this.props.getStationsInfo();
      this.props.getStationStatus();

      return (
        <Container>
          <Row>
            <Col className='text-center mt-5'>
              <FontAwesomeIcon icon={faSpinner}/>
              <h2>Fetching bike stations near you.</h2>
            </Col>
          </Row>
        </Container>
      ); 
    } else if (stationInfoLoading === Success) {      
      return (
        <Container fluid>
          <Row>
            <Col sm='12' className='p-0'> 
              <Switch>
                <Route path="/stations/:stationId" component={BikeDetailsComponent} />
                <Redirect from="/stations" to="/" />
                <Route path="/" component={Home} exact />
              </Switch>
            </Col>
          </Row>
        </Container>
      );
    } else if (stationInfoLoading === Error) {
      return (
        <Container>
          <Row>
            <Col className='text-center mt-5'>
              <h2>Opps, we were unable to grab stations near you. Please make sure you are connect to internet and try again.</h2>
            </Col>
          </Row>
        </Container>
      );
    }
    return;
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

