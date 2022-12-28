import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFieldMappingComponent } from './category-field-mapping.component';

describe('CategoryFieldMappingComponent', () => {
  let component: CategoryFieldMappingComponent;
  let fixture: ComponentFixture<CategoryFieldMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryFieldMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFieldMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
