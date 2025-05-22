import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHistoryComponent } from './panel-history.component';

describe('PanelHistoryComponent', () => {
  let component: PanelHistoryComponent;
  let fixture: ComponentFixture<PanelHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
