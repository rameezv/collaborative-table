import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketTableComponent } from './socket-table.component';

describe('SocketTableComponent', () => {
  let component: SocketTableComponent;
  let fixture: ComponentFixture<SocketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
