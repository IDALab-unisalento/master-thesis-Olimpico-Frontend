import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortalityComponent } from './mortality.component';

describe('MortalityComponent', () => {
  let component: MortalityComponent;
  let fixture: ComponentFixture<MortalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortalityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
