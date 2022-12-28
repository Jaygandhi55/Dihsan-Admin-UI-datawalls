import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateEndpointComponent } from './create-update-endpoint.component';

describe('CreateUpdateEndpointComponent', () => {
  let component: CreateUpdateEndpointComponent;
  let fixture: ComponentFixture<CreateUpdateEndpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateUpdateEndpointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
