import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateInputComponent } from './plate-input.component';

describe('PlateInputComponent', () => {
  let component: PlateInputComponent;
  let fixture: ComponentFixture<PlateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlateInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
