import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactSocketTableComponent } from '../react-socket-table/react-socket-table.component';

@Component({
  selector: 'app-socket-table',
  standalone: true,
  imports: [ReactSocketTableComponent],
  templateUrl: './socket-table.component.html',
  styleUrl: './socket-table.component.css'
})
export class SocketTableComponent implements OnInit {
  sessionId?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') || undefined;
  }
}
