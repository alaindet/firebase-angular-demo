import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { Task } from './task/task.types';

const getObservable = (
  collection: AngularFirestoreCollection<Task>,
): BehaviorSubject<Task[]>=> {
  const subject = new BehaviorSubject<Task[]>([]);
  collection
    .valueChanges({ idField: 'id' })
    .subscribe(
      (tasks: Task[]) => subject.next(tasks)
    );
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  todo: BehaviorSubject<Task[]> = getObservable(
    this.store.collection('todo')
  );
  inProgress: BehaviorSubject<Task[]> = getObservable(
    this.store.collection('inProgress')
  );
  done: BehaviorSubject<Task[]> = getObservable(
    this.store.collection('done')
  );

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
  ) {}

  drop(event: CdkDragDrop<Task[]>): void {

    if (event.previousContainer === event.container) {
      return;
    }

    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      return Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
    });

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
          if (result.delete) {
            this.store.collection(list).doc(task.id).delete();
          } else {
            this.store.collection(list).doc(task.id).update(task);
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
        (result: TaskDialogResult) => {
          this.store.collection('todo').add(result.task);
        },
      );
  }
}
