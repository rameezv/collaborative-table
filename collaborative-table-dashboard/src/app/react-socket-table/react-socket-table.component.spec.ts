import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactSocketTableComponent } from './react-socket-table.component';

describe('ReactSocketTableComponent', () => {
  let component: ReactSocketTableComponent;
  let fixture: ComponentFixture<ReactSocketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactSocketTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactSocketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
