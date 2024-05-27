import { Routes } from '@angular/router';
import { SocketTableComponent } from './socket-table/socket-table.component';
import { CreateSessionComponent } from './create-session/create-session.component';

export const routes: Routes = [
  {path: '', component: CreateSessionComponent},
  {path: 'table/:sessionId', component: SocketTableComponent},
  {path: '**', redirectTo: ''}
];
