// panelsmanagement.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPanelComponent } from '../add-panel/add-panel.component';
import { PanelService } from '../../services/panel/panel.service';
import { CommonModule } from '@angular/common';
import {EditPanelComponent} from '../edit-panel/edit-panel.component';
import {DeletePanelComponent} from '../delete-panel/delete-panel.component';

@Component({
  selector: 'app-panelsmanagement',
  templateUrl: './panelsmanagement.component.html',
  styleUrls: ['./panelsmanagement.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PanelsmanagementComponent implements OnInit {

  panels: any[] = [];

  constructor(
    private dialog: MatDialog,
    private panelService: PanelService
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

  openAddPanelModal(): void {
    const dialogRef = this.dialog.open(AddPanelComponent, {
      width: '450px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fetchPanels();
      }
    });
  }

  openEditPanel(panel: any) {
    const dialogRef = this.dialog.open(EditPanelComponent, {
      width: '450px',
      data: panel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fetchPanels();
      }
    });
  }

  openDeletePanel(panel: any) {
    const dialogRef = this.dialog.open(DeletePanelComponent, {
      width: '450px',
      data: panel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.fetchPanels();
      }
    });
  }

}
