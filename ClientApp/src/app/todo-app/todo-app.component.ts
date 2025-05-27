import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'todo-app',
  templateUrl: './todo-app.component.html',
  styleUrls: [ './todo-app.component.css' ],
})
export class TodoAppComponent {
  todoItems: TodoItem[] = [];
  completedItems: TodoItem[] = [];
  public model = { doDate: '', taskName: '' };

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    console.log(baseUrl);
    http.get<TodoItem[]>(baseUrl + 'todoapp').subscribe({
      next: result => {
        this.todoItems = result.filter(item => !item.taskDone);
        this.completedItems = result.filter(item => item.taskDone);
      },
      error: error => console.error(error)
    });
  }

  drop(event: CdkDragDrop<TodoItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      var movedItem = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const taskName = movedItem.taskName;

      this.http.put<string>(this.baseUrl + "todoapp", JSON.stringify(taskName), {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: _ => movedItem.taskDone = true,
        error: error => console.log(error),
      });
    }
  }

  dropWithin(event: CdkDragDrop<TodoItem[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return ;
    }

    var item: TodoItem = {
      taskName: this.model.taskName,
      doDate: new Date(this.model.doDate),
      taskDone: false,
    };

    if (this.todoItems.find(it_item => it_item.taskName == item.taskName )) {
      alert("Item's must have different names!")
      return;
    }

    this.http.post<TodoItem>(this.baseUrl + 'todoapp', item).subscribe({
      next: _ => {
        form.reset;
        this.todoItems.push(item);
      },
      error: error => console.log(error),
    });

    form.reset();
  }
}

interface TodoItem {
  doDate: Date;
  taskName: string;
  taskDone: boolean;
}
