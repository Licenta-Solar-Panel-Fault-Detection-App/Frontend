import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelService } from '../../services/panel/panel.service';
import { ReportService} from '../../services/report/report.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-panel-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-history.component.html',
  styleUrl: './panel-history.component.css'
})
export class PanelHistoryComponent {

  panelId!: number;
  panelName!: string;
  checks: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private panelService: PanelService,
    private reportService: ReportService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const state = history.state;
    if (state && state.panelId) {
      this.panelId = state.panelId;
      this.panelName = state.panelName;
      this.getChecks();
    } else {
      this.router.navigate(['/panels']);
    }
  }

  getChecks(): void {
    this.panelService.getChecksByPanel(this.panelId).subscribe({
      next: (data) => {
        this.checks = data
          .map((check: any) => ({ ...check, hasReport: false }))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.checks.forEach((check, index) => {
          this.reportService.getReportByCheck(check.id).subscribe({
            next: (report) => {
              this.checks[index].hasReport = !!report;
            },
            error: () => {
              this.checks[index].hasReport = false;
            }
          });
        });
      },
      error: (err) => {
        console.error('Failed to load checks', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}
