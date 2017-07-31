import React from 'react';
import { 
  Map, 
  TileLayer, 
  WMSTileLayer,
  AttributionControl, 
  CircleMarker, 
  Tooltip, 
  Popup, 
  Marker, 
  LayerGroup,
  GeoJSON,
  FeatureGroup,
  Pane
} from 'react-leaflet';

import { divIcon } from 'leaflet';
import { observer } from 'mobx-react';

import Base from './../base';


@observer
export default class AppMap extends React.Component {
  constructor(props) {
    super(props);
  }

  style() {
    return {

    }
  }


  mapStyle() {
    return {
      width: '100%',
      height: '100%'
    }
  }

  handleClickMarker(rowId) {
    appStore.gotoRecord(rowId);
  }

  handleDragMarker(e) {
    const targetLatLng = e.target._latlng;
    appStore.updateRecordLocation(targetLatLng.lng, targetLatLng.lat);
  }

  handleMapClick(e) {
    appStore.updateRecordLocation(e.latlng.lng, e.latlng.lat);
  }

  renderBaseLayer(top) {
    const basemap = top ? appStore.basemap1 : appStore.basemap2;
    const opacity = top ? 1 - appStore.mapOpacityRatio : appStore.mapOpacityRatio;

    if (basemap.type === 'tile') {
      return (
        <TileLayer key={top ? '1' : '2'} opacity={opacity} {...basemap} />  
      );
    } else if (basemap.type === 'wms') {
      return (
        <WMSTileLayer key={top ? '1' : '2'} opacity={opacity} {...basemap} />  
      );
    } 
  }

  renderBaseLayers() {
    return (
      <LayerGroup>
        {
          this.renderBaseLayer(false)
        }{
          this.renderBaseLayer(true)
        }
      </LayerGroup>
    )
  }

  renderOverlays() {
    return (
      <LayerGroup>
        {
          appStore.overlays.map( (o, oid) => {
            const overlay = overlaymaps[o.id];
            const zIndex = 400 - oid;

            if (overlay.type === 'wms') {
              return (
                <WMSTileLayer key={o.id} zIndex={zIndex}
                  {...overlay} 
                  opacity={o.opacity}
                />
              );
            } else if (overlay.type === 'geojson') {
              return (
                <Pane style={{zIndex: zIndex}} key={o.id} name={overlay.id}>
                  <GeoJSON 
                    {...overlay} 
                    opacity={o.opacity * overlay.opacity || o.opacity} 
                    fillOpacity={o.opacity * overlay.fillOpacity || o.opacity}  
                  /> 
                </Pane> 
              );
            }
          })
        }
      </LayerGroup>
    )
  }

  render() {
    const store = appStore;
    
    return (
      <div className="map-wrapped" style={this.style()} >
        <Map 
          center={store.mapPosition}
          zoom={store.mapZoom}
          onViewportChanged={store.mapMoved}
          useFlyTo={true}
          ref="map" 
          onClick={this.handleMapClick.bind(this)}
          style={this.mapStyle()}
          attributionControl={false}
        >
          <AttributionControl position="bottomleft" />
          {
            /* basemaps */
            this.renderBaseLayers()
          }
          {
            /* overlays */
            this.renderOverlays()
          }
          {
            // rendering records
            store.geoRecords.filter(Base.validGeo).map( (record, ri) => {
              const active = record.row.toString() === appStore.recordRow.toString()
              //const style = this.styleMarker(active);

              const iconClasses = active ? 'icon is-medium' : 'icon is-small';
              const iconSize = [20, 20];
              const style = active ? 
                "color: #ca5900; vertical-align: bottom" : 
                "color: black; vertical-align: bottom";

              const icon = divIcon({
                html: '<span style="' + style + '" class="icon"><i class="fa fa-map-marker"></i></span>',
                className: 'map-sort-icon',
                iconAnchor: [iconSize[0]/2, iconSize[1]],
                iconSize: iconSize
              });

              return (
                <LayerGroup key={ri}>
                  <Marker 
                    position={[parseFloat(record.y), parseFloat(record.x)]} 
                    icon={icon}
                    onClick={this.handleClickMarker.bind(this, record.row)}
                    draggable={active}
                    onDragEnd={this.handleDragMarker.bind(this)}
                  >
                    <Tooltip offset={[10, -10]} direction="right" >
                      <h4>{record.name}</h4>
                    </Tooltip>
                  </Marker>
                </LayerGroup>
              )
            })
          }
          {
            /* geoname point */
            appStore.hlPoint ?
              (
                <LayerGroup key="hl-point"  >
                  <CircleMarker 
                    className="hl-point"
                    center={[appStore.hlPoint[0], appStore.hlPoint[1]]} 
                    radius={10}
                  />
                </LayerGroup>
              ) : null

          }
        </Map>
      </div>
    )
  }
}