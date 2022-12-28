import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateSupplierComponent } from './create-update-supplier.component';

describe('CreateUpdateSupplierComponent', () => {
  let component: CreateUpdateSupplierComponent;
  let fixture: ComponentFixture<CreateUpdateSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateSupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
