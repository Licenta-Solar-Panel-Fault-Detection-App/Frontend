import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'esri-leaflet';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private openStreetLayer!: L.TileLayer;
  private esriLayer!: L.TileLayer;
  private esriLabels!: L.TileLayer;
  isSatelliteView = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.9432, 24.9668], // România (centrat)
      zoom: 7

    });

    this.openStreetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    this.esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    this.esriLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Labels © Esri',
      pane: 'overlayPane'
    });

    this.openStreetLayer.addTo(this.map); // default
  }

  setMapStyle(satellite: boolean): void {
    if (satellite) {
      this.map.removeLayer(this.openStreetLayer);
      this.esriLayer.addTo(this.map);
      this.esriLabels.addTo(this.map);
    } else {
      this.map.removeLayer(this.esriLayer);
      this.map.removeLayer(this.esriLabels);
      this.openStreetLayer.addTo(this.map);
    }
    this.isSatelliteView = satellite;
  }

}
