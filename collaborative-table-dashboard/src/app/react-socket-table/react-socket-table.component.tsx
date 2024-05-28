import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { ReactSocketTable } from './react-component/socket-table';

@Component({
  selector: 'app-react-socket-table',
  standalone: true,
  imports: [],
  templateUrl: './react-socket-table.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReactSocketTableComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('reactWrapper') wrapperRoot!: ElementRef;

  @Input() sessionId: string = '';

  root?: Root;

  ngAfterViewInit() {
    this.root = createRoot(this.wrapperRoot.nativeElement);
    this.reRenderComponent();
  }

  ngOnChanges() {
    this.reRenderComponent();
  }

  ngOnDestroy() {
    this.root?.unmount();
  }

  private reRenderComponent() {
    this.root?.render(<div><ReactSocketTable sessionId={this.sessionId} /></div>);
  }
}
