// panelsmanagement.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPanelComponent } from '../add-panel/add-panel.component';
import { PanelService } from '../../services/panel/panel.service';
import { CommonModule } from '@angular/common';
import {EditPanelComponent} from '../edit-panel/edit-panel.component';
import {DeletePanelComponent} from '../delete-panel/delete-panel.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PanelsComponent implements OnInit {

  panels: any[] = [];

  constructor(
    private dialog: MatDialog,
    private panelService: PanelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPanels();
  }

  fetchPanels() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    this.panelService.getByUser(Number(user_id)).subscribe({
      next: data => this.panels = data,
      error: err => console.error('Failed to fetch panels', err)
    });
  }

  goCheck(panelId: number, panelName: string, panelLatitude: number, panelLongitude: number) {
    this.router.navigate(['/upload'], {
      state: {panelId, panelName, panelLatitude, panelLongitude}
      }
    );
  }

  goHistory(panelId: number, panelName: string, panelLatitude: number, panelLongitude: number) {
    this.router.navigate(['/panels/history'], {
      state: {panelId, panelName, panelLatitude, panelLongitude}    }
    );
  }

}
