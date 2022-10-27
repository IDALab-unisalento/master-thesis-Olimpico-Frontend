import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagraphicComponent } from './anagraphic.component';

describe('AnagraphicComponent', () => {
  let component: AnagraphicComponent;
  let fixture: ComponentFixture<AnagraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnagraphicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnagraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
