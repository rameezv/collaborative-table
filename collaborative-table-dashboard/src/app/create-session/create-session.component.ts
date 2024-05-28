import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [],
  templateUrl: './create-session.component.html',
})
export class CreateSessionComponent {
  constructor(private router: Router) {}

  createSession() {
    const newId = uuidv4();
    this.router.navigate(['table', newId]);
  }
}
