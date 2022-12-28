import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateScheduleComponent } from './create-update-schedule.component';

describe('CreateUpdateScheduleComponent', () => {
  let component: CreateUpdateScheduleComponent;
  let fixture: ComponentFixture<CreateUpdateScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
