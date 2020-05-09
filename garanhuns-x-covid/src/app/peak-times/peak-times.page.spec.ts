import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PeakTimes } from './peak-times.page';

describe('PeakTimes', () => {
  let component: PeakTimes;
  let fixture: ComponentFixture<PeakTimes>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PeakTimes],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PeakTimes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
