import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

import { environment } from 'src/environments/environment';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
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

  constructor(
    private dialog: MatDialog,
  ) {
    console.log(environment?.firebase);
  }

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

  edit(list: 'todo' | 'inProgress' | 'done', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        task,
        enableDelete: true,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: TaskDialogResult) => {
          const dataList = this[list];
          const taskIndex = dataList.indexOf(task);
          if (result.delete) {
            dataList.splice(taskIndex, 1);
          } else {
            dataList[taskIndex] = task;
          }
        },
      );
  }

  newTask(): void {

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        task: {},
      }
    });

    dialogRef
      .afterClosed()
      .subscribe(
        (result: TaskDialogResult) => this.todo.push(result.task),
      );
  }
}
