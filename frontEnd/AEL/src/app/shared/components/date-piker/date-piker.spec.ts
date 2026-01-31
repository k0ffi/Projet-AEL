import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePiker } from './date-piker';

describe('DatePiker', () => {
  let component: DatePiker;
  let fixture: ComponentFixture<DatePiker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePiker],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePiker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
