import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationTimetableComponent } from './station-timetable.component';

describe('StationTimetableComponent', () => {
  let component: StationTimetableComponent;
  let fixture: ComponentFixture<StationTimetableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationTimetableComponent]
    });
    fixture = TestBed.createComponent(StationTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
