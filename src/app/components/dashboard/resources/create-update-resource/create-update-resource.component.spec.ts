import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateResourceComponent } from './create-update-resource.component';

describe('CreateUpdateResourceComponent', () => {
  let component: CreateUpdateResourceComponent;
  let fixture: ComponentFixture<CreateUpdateResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
