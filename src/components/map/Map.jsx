import React, { Component } from 'react';
import { MirrorEvents } from '../../helpers/events';
import { resolveLocation } from '../../providers/location';
import { buildTileGrid } from '../../providers/map';
import './Map.css';

export class Map extends Component {
  state = { status: 'loading', location: null, error: '' };

  componentDidMount() {
    this.handlers = [
      MirrorEvents.addListener('SECONDARY_HOLD', this.props.secondaryHold),
      MirrorEvents.addListener('SECONDARY_CLICK', this.props.secondaryClick),
    ];
    this.loadLocation();
  }

  componentWillUnmount() {
    this.handlers.forEach((handler) => handler.remove());
  }

  async loadLocation() {
    try {
      const location = await resolveLocation(this.props.locationCache);
      this.setState({ status: 'ready', location, error: '' });
    } catch (error) {
      this.setState({ status: 'error', location: null, error: error.message });
    }
  }

  render() {
    if (this.state.status === 'loading') return <div className="map-status">Loading map…</div>;
    if (this.state.status === 'error') return <div className="map-status">{this.state.error}</div>;

    const { location } = this.state;
    const tiles = buildTileGrid(location, {
      width: globalThis.innerWidth || 768,
      height: globalThis.innerHeight || 1366,
    });
    return (
      <div className="map-page" aria-label={`Map centered on ${location.name}`}>
        <div className="map-tile-layer" aria-hidden="true">
          {tiles.map((tile) => (
            <img className="map-tile" key={tile.key} src={tile.url} alt="" draggable="false"
              style={{ left: tile.left, top: tile.top }} />
          ))}
        </div>
        <div className="map-shade" aria-hidden="true" />
        <div className="map-center-marker" aria-hidden="true"><span /></div>
        <div className="map-location-label">{location.name}</div>
        <div className="map-attribution">
          © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
          {' '}© <a href="https://carto.com/attributions">CARTO</a>
        </div>
      </div>
    );
  }
}
