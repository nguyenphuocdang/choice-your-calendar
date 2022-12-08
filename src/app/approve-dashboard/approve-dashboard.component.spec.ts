import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveDashboardComponent } from './approve-dashboard.component';

describe('ApproveDashboardComponent', () => {
  let component: ApproveDashboardComponent;
  let fixture: ComponentFixture<ApproveDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
