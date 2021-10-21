import { Task } from "../../interface/task";
import { catchError, finalize, map } from "rxjs/operators";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of } from "rxjs";
import { TaskService } from "../../api/task.service";

export class ArchivesDataSource implements DataSource<Task> {

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private taskService: TaskService) { }

  connect(collectionViewer: CollectionViewer): Observable<Task[]> {

    return this.tasksSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tasksSubject.complete();
    this.loadingSubject.complete();
  }

  loadArchivesTasks() {
    console.log('datasoruce load tasks');
    this.loadingSubject.next(true);
    this.taskService.listActiveTasks()
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
        //TODO: prendr que ceux qui ont zone = 0

        map(tasks =>
          tasks = tasks.filter(task => this.taskService.getLastMutation(task).zone == 0)
        )
      )
      .subscribe(tasks => this.tasksSubject.next(tasks));
  }
}
