import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'esri-leaflet';
import {NgClass} from '@angular/common';
import {PanelService} from '../../services/panel/panel.service';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddPanelComponent } from '../add-panel/add-panel.component';


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
  panels: any[] = [];
  private userLocationMarker: L.Marker | null = null;


  constructor(private panelService: PanelService, private router: Router, private dialog: MatDialog) {}


  openAddPanelModalFromMap(lat: number, lng: number): void {
    const dialogRef = this.dialog.open(AddPanelComponent, {
      width: '450px',
      data: { latitude: lat, longitude: lng }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loadPanelsAndAddPins();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadPanelsAndAddPins();
    this.addUserLocationMarker();

    window.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('popup-btn')) return;

      const panelId = Number(target.getAttribute('data-id'));
      const type = target.getAttribute('data-type');
      const panel = this.panels.find(p => p.id === panelId);
      if (!panel) return;

      if (type === 'check') {
        this.router.navigate(['/upload'], {
          state: {
            panelId: panel.id,
            panelName: panel.name,
            panelLatitude: panel.latitude,
            panelLongitude: panel.longitude
          }
        });
      }

      if (type === 'history') {
        this.router.navigate(['/panels/history'], {
          state: {
            panelId: panel.id,
            panelName: panel.name,
            panelLatitude: panel.latitude,
            panelLongitude: panel.longitude
          }
        });
      }
    });

    let isDragging = false;

    this.map.on('mousedown', () => {
      isDragging = false;
    });

    this.map.on('mousemove', () => {
      isDragging = true;
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (isDragging) return;

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      this.openAddPanelModalFromMap(lat, lng);
    });

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



  private async loadPanelsAndAddPins(): Promise<void> {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    this.panelService.getByUser(Number(user_id)).subscribe(panels => {
      this.panels = panels;
      panels.forEach(panel => {
        this.panelService.getLastStatusByPanel(panel.id).subscribe(response => {
          const status = response.status;
          const date = response.timestamp
            ? new Date(response.timestamp).toLocaleString()
            : 'N/A';
          const color = this.getPinColor(status);

          const svgHtml = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="36">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 7.25 12 24 12 24s12-16.75 12-24C24 5.373 18.627 0 12 0z"
                    fill="${color}" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="5" fill="white"/>
            </svg>
          `;

          const icon = L.divIcon({
            className: '',
            html: svgHtml,
            iconSize: [30, 36],
            iconAnchor: [15, 36],
            popupAnchor: [0, -36]
          });

          L.marker([panel.latitude, panel.longitude], { icon })
            .addTo(this.map)
            .bindPopup(`
                <strong>${panel.name}</strong>
                <br>Status: ${status}
                <br>Date: ${date}<br>
                <button class="popup-btn" data-type="check" data-id="${panel.id}">✔️ Check</button>
                <button class="popup-btn" data-type="history" data-id="${panel.id}">📜 History</button>
             `);
        });
      });
    });
  }

  centerOnUser(): void {
    if (!this.userLocationMarker) {
      alert("User location not yet determined.");
      return;
    }

    this.map.setView(this.userLocationMarker.getLatLng(), 16);
  }


  private addUserLocationMarker(): void {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const svgHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="36">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 7.25 12 24 12 24s12-16.75 12-24C24 5.373 18.627 0 12 0z"
              fill="purple" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="5" fill="white"/>
      </svg>
    `;

      const icon = L.divIcon({
        className: '',
        html: svgHtml,
        iconSize: [30, 36],
        iconAnchor: [15, 36],
        popupAnchor: [0, -36]
      });

      this.userLocationMarker = L.marker([lat, lng], { icon }).addTo(this.map);
    });
  }



  private getPinColor(status: string): string {
    switch (status) {
      case 'Clean':
        return 'green';
      case 'Dusty':
      case 'Bird-drop':
      case 'Snow-Covered':
        return 'orange';
      case 'Electrical-damage':
      case 'Physical-Damage':
        return 'red';
      case 'Not-Verified':
        return 'gray';
      case 'Not-Detected':
      default:
        return 'black';
    }
  }

}

