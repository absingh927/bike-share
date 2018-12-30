import * as React from 'react';
import { connect } from 'react-redux';
import { StationStatus, Station } from '../types';
import { AppState } from 'src/AppState';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { find, filter } from 'lodash-es';
import { Navbar, Button, Card, CardBody, Row, Col, CardTitle, CardSubtitle, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faArrowLeft, faBicycle, faGasPump, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { getStationStatus } from '../Stations/StationActions';

type BikeDetailsRouteParams = {
  stationId: string;
};

type BikeDetailOwnProps = RouteComponentProps<BikeDetailsRouteParams>;

type BikeDetailMergeProps = BikeDetailOwnProps & {
  stationStatuses: StationStatus[];
  statusLastUpdated: number;
  stations: Station[];
  statusTTL: number;
};

const mapDispatchToProps = {
  getStationStatus
};

type BikeDetailProps = BikeDetailMergeProps & typeof mapDispatchToProps;

const mapStateToProps = (store: AppState, ownProps?: BikeDetailOwnProps): BikeDetailMergeProps => {
  if (!ownProps || !store.stations) {
    throw new Error();
  }

  return {
    ...ownProps,
    stationStatuses: store.stations.statuses,
    statusLastUpdated: store.stations.statusLastUpdated,
    stations: store.stations.stations,
    statusTTL: store.stations.statusTTL
  };
}

class BikeDetails extends React.PureComponent<BikeDetailProps> {
  private pollInterval: NodeJS.Timeout;

  constructor(props: BikeDetailProps) {
    super(props);  
  }

  public componentDidMount() {
    // use station status TTL value to call for updated statuses
    this.pollInterval = setInterval(() => this.props.getStationStatus(), this.props.statusTTL * 1000);
  }

  public componentWillUnMount = () => {
    this.endTimer();
  }

  public render() {
    const stationID = this.props.match.params.stationId;
    const StationStatus = find(this.props.stationStatuses,['station_id', stationID]);

    if (!StationStatus) {
      return this.renderError();
    }
    
    // combine name and stationStatus for single object
    const stationName = filter(this.props.stations, ['station_id', stationID])[0].name;
    const station = { ...StationStatus, name: stationName };
     
    return (
      <>
        {this.renderBackNavigaiton()}
        <Container>
          <Row>
            <Col xs='12'> 
              {this.renderStationStatusInfo(station)}
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  private endTimer = () => {
    clearInterval(this.pollInterval);
  }

  private renderBackNavigaiton = () => {
    return (
      <Navbar color='light' light expand='sm' className='border-bottom sticky-top'>
        <Link to={{pathname: `/stations`}}>
          <Button outline color='secondary' className='border-0' onClick={this.endTimer}>          
            <FontAwesomeIcon icon={faArrowLeft} className='pr-1' />
            Back 
          </Button>
        </Link> 
      </Navbar>
    );
  }

  private renderError = () => {
    return (
      <Card className='m-3'>
        <Row className='text-center'>
          <Col xs='12'>
            <CardBody>
              <FontAwesomeIcon icon={faExclamation} />
              <CardSubtitle>Oops, there seems to be an issue</CardSubtitle>
              <CardSubtitle>Please go back and try again</CardSubtitle>
            </CardBody>
          </Col>
        </Row>
      </Card>
    )
  }

  private renderStationStatusInfo = (station: StationStatus) => {
    return (
      <Card className='m-3'>
        <Row className='text-center'>
          <Col xs='12'>
            <CardBody>
              <FontAwesomeIcon icon={faMapMarkerAlt} />  
              <CardTitle>{station.name}</CardTitle>
            </CardBody>
          </Col>
        </Row>
        <Row className='text-center'>
          <Col xs='6'>
            <CardBody>
              <CardSubtitle className={`${this.getColorClass(station.num_bikes_available)}`}>
                <FontAwesomeIcon icon={faBicycle} className='mr-2'/>
                {`${station.num_bikes_available} ${station.num_bikes_available > 1 ? 'Bikes' : 'Bike'}`}
              </CardSubtitle>
            </CardBody>
          </Col>
          <Col xs='6'>
            <CardBody>
              <CardSubtitle className={`${this.getColorClass(station.num_docks_available)}`}>
                <FontAwesomeIcon icon={faGasPump} className='mr-2' />
                {`${station.num_docks_available} ${station.num_docks_available > 1 ? ' Docks' : ' Dock'}`}
              </CardSubtitle>
            </CardBody>
          </Col>
        </Row>
        <Row className='text-center'>
          <Col>
            <CardBody>
              <CardSubtitle> Updated {moment.unix(this.props.statusLastUpdated).fromNow()}</CardSubtitle>
            </CardBody>          
          </Col>
        </Row>
      </Card>
    );
  }

  private getColorClass = (quantiy: number) => {
    if (quantiy === 0 ){
      return 'text-danger';
    }
    else if (quantiy === 1 ) {
      return 'text-warning';
    }
    return 'text-success';
  }
}

export const BikeDetailsComponent = withRouter(connect(mapStateToProps, mapDispatchToProps)(BikeDetails))
