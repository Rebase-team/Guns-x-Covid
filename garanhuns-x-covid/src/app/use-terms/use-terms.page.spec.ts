import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UseTermsPage } from './use-terms.page';

describe('UseTermsPage', () => {
  let component: UseTermsPage;
  let fixture: ComponentFixture<UseTermsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseTermsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UseTermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
