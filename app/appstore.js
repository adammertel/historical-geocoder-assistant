import { observable, action, computed } from 'mobx';
import Sheet from './sheet.js'
import Base from './base.js'

export default class AppStore {
    @observable columns = {
        name: 'name',
        x: 'x',
        y: 'y'
    };

    @observable recordRow = 2;
    @observable records = {};
    @observable wikiText = '';
    
    @observable mapPosition = [[49, 20], [50, 21]];
    @observable mapOpacityRatio = 0; 
    @observable map1Id = false; 
    @observable map2Id = false;

    constructor () {
        this.noRecords = 65;
        this.updateData();
        this.map1Id = Object.keys(window['basemaps'])[0]; 
        this.map2Id = Object.keys(window['basemaps'])[1]; 
    }

    /*
        GETTERS
    */
    @computed get mapPositionArray () { 
        return [this.mapPosition[0].slice(), this.mapPosition[1].slice()];
    };

    @computed get basemap1 () {
        return this.basemapById(this.map1Id);
    }

    @computed get basemap2 () {
        return this.basemapById(this.map2Id);
    }

    @computed get recordData () {
        return this.records[this.recordRow] ? 
            Object.assign(this.records[this.recordRow], {}) : {}
    }

    @computed get recordName () {
        return this.recordData[this.columns.name];
    }

    @computed get recordX () {
        return this.recordData[this.columns.x];
    }
    @computed get recordY () {
        return this.recordData[this.columns.y];
    }
    @computed get wikiTextShort () {
        if (!this.wikiText) {
            return 'not found'
        } else {
            return this.wikiText.split('</p>')[0] + '</p>';
        }
    }
    @computed get geoRecords () {
        return Object.keys(this.records).map( rowNo => {
            const record = this.records[rowNo];
            return {
                x: record[this.columns.x],
                y: record[this.columns.y],
                name:  record[this.columns.name]
            }
        }) 
    }


    /* 
        ACTIONS
    */

    // map position
    @action setMapPosition = (position) => this.mapPosition = position;
    @action mapMoved = () => {
        if (map) {
            const newBounds = map.getBounds();
            const sw = newBounds.getSouthWest();
            const ne = newBounds.getNorthEast();
            this.mapPosition = [[sw.lat, sw.lng], [ne.lat, ne.lng]];
        }
    }

    @action updateWiki = () => {
        Base.wiki(this.recordName, (response) => {
            this.wikiText = response;
        });
    }

    // map tiles
    @action changeOpacityRatio = (opacity) => {
        this.mapOpacityRatio = opacity;
    }

    @action changeOpacityRatio = (opacity) => {
        this.mapOpacityRatio = opacity;
    }

    @action changeBaseMap = (mid, bmid) => {
        this['map' + mid + 'Id'] = bmid;
    }


    // changing recordRow
    @action nextRecord = () => {
        this.recordRow = this.recordRow === this.noRecords ? 1 : this.recordRow + 1;
        this.updateData();
    }

    @action previousRecord = () => {
        this.recordRow = this.recordRow === 1 ? this.recordRow - 1 : this.noRecords;
        this.updateData();
    }
    
    @action gotoRecord = (recordRow) => {
        this.recordRow = recordRow;
        this.updateData();
    }

    // new data are loaded
    @action updateData = () => {
        Sheet.readAllLines( this.noRecords, (data) => {
            console.log(data)
            this.records = data;
            this.updateWiki();
        });
    }

    // locally store new values
    @action updateRecordValue = (column, value) => {
        if (column === this.columns.name) {
            this.updateWiki();
        }
        this.records[this.recordRow][column] = value;
    }

    // save local values to sheet
    @action saveRecord = () => {
        Sheet.updateLine(this.recordRow, Object.values(this.recordData), () => {
            this.updateData();
        })
    }


    /*
        METHODS
    */

    basemapById (basemapId) { 
        return window['basemaps'][basemapId];
    };
}