import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Leaderbaords } from './leaderbaords';

describe('Leaderbaords', () => {
  let component: Leaderbaords;
  let fixture: ComponentFixture<Leaderbaords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Leaderbaords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Leaderbaords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
