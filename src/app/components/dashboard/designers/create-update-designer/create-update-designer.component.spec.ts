import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateDesignerComponent } from './create-update-designer.component';

describe('CreateUpdateDesignerComponent', () => {
  let component: CreateUpdateDesignerComponent;
  let fixture: ComponentFixture<CreateUpdateDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
