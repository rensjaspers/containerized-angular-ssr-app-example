import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  todosResource = httpResource<Todo[]>(() => '/api/todos');
}
