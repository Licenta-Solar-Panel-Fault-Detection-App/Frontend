import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, Prediction } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  predictions: Prediction[] = [];

  userId: number = Number(localStorage.getItem('user_id'));

  // Filtre
  filterType: 'all' | 'reported' = 'all';
  modelFilter: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchStats();
    this.fetchPredictions();
  }

  fetchStats(): void {
    this.dashboardService.getStats(this.userId).subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error fetching stats:', err)
    });
  }

  fetchPredictions(): void {
    const reported = this.filterType === 'reported' ? true : undefined;
    const model = this.modelFilter ?? undefined;

    this.dashboardService.getPredictions(this.userId, reported, model).subscribe({
      next: (data) => {
        this.predictions = data.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      },
      error: (err) => console.error('Error fetching predictions:', err)
    });
  }

  setFilterType(type: 'all' | 'reported') {
    this.filterType = type;
    this.fetchPredictions();
  }

  toggleModel(model: string) {
    if (this.modelFilter === model) {
      this.modelFilter = null;
    } else {
      this.modelFilter = model;
    }
    this.fetchPredictions();
  }

  isModelActive(model: string): boolean {
    return this.modelFilter === model;
  }

  onDeletePrediction(checkId: number) {
    if (!confirm("Are you sure you want to delete this prediction?")) return;
    this.dashboardService.deletePrediction(checkId).subscribe({
      next: () => this.fetchPredictions(),
      error: (err) => console.error("Failed to delete prediction", err)
    });
  }

  onDeleteReport(reportId: number) {
    if (!confirm("Are you sure you want to delete this report?")) return;
    this.dashboardService.deleteReport(reportId).subscribe({
      next: () => this.fetchPredictions(),
      error: (err) => console.error("Failed to delete report", err)
    });
  }

  onEditReport(reportId: number) {
    const description = prompt("Enter new description:");
    if (description !== null) {
      this.dashboardService.editReport(reportId, description).subscribe({
        next: () => this.fetchPredictions(),
        error: (err) => console.error("Failed to edit report", err)
      });
    }
  }
}
