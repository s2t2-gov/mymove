// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Alert from 'shared/Alert';
import ShipmentCards from 'scenes/Shipments/ShipmentCards';

import { loadShipments } from './ducks';

export class Shipments extends Component {
  componentDidMount() {
    this.props.loadShipments();
  }
  render() {
    const { shipments, hasError } = this.props;
    const shipmentsStatus = this.props.match.params.shipmentsStatus;

    // Title with capitalized shipment status
    const capShipmentsStatus =
      shipmentsStatus.charAt(0).toUpperCase() + shipmentsStatus.slice(1);
    document.title = `Transcom PPP: ${capShipmentsStatus} Shipments`;

    // Handle cases of users entering invalid shipment types
    if (
      shipmentsStatus !== 'awarded' &&
      shipmentsStatus !== 'available' &&
      shipmentsStatus !== 'all'
    ) {
      return (
        <Alert type="error" heading="Invalid Shipment Type Error">
          You've attempted to access an inaccessible route. Invalid Shipment
          Status: {shipmentsStatus}.
        </Alert>
      );
    }

    const filteredShipments = shipments.filter(shipment => {
      return (
        shipmentsStatus === 'all' ||
        (shipment.transportation_service_provider_id &&
          shipmentsStatus === 'awarded') ||
        (!shipment.transportation_service_provider_id &&
          shipmentsStatus === 'available')
      );
    });

    return (
      <div className="usa-grid">
        <h1>{capShipmentsStatus} Shipments</h1>
        {hasError && (
          <Alert type="error" heading="Server Error">
            There was a problem loading the shipments from the server.
          </Alert>
        )}
        {!hasError && <ShipmentCards shipments={filteredShipments} />}
      </div>
    );
  }
}

Shipments.propTypes = {
  loadShipments: PropTypes.func.isRequired,
  shipments: PropTypes.array,
  hasError: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    shipments: state.shipments.shipments,
    hasError: state.shipments.hasError,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadShipments }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipments);
