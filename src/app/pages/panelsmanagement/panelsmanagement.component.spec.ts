import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelsmanagementComponent } from './panelsmanagement.component';

describe('PanelsmanagementComponent', () => {
  let component: PanelsmanagementComponent;
  let fixture: ComponentFixture<PanelsmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelsmanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelsmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
