import { Component } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { Task } from './task/task.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  todo: Task[] = [
    { title: 'Buy milk', description: 'Go to the store and buy it' },
    { title: 'Create Kanban board', description: 'Develop a Kanban app' },
  ];

  inProgress: Task[] = [];

  done: Task[] = [];

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    )
  }

  edit(list: string, task: Task): void {

  }
}
