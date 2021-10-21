import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, pipe, combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Task, Mutation, ResultApiOneTask } from '../interface/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiBaseUrl = 'http://localhost:20800';
  constructor(private http: HttpClient) { }

  // persistent functions
  saveTasks(tasks: Task[]): Observable<Task[]> {
    console.log('ok lets save all to database:' + JSON.stringify(tasks));
    throw new Error('method not verified - please dont use for now...');
    const observables$: Observable<Task>[] = [];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    tasks.forEach(element => {
      console.log('save task:' + JSON.stringify(element));
      //HACK to remove $loki property if it's value = 0
      const elementCopy: any = element;
      if (element.$loki == 0) {
        delete elementCopy['$loki'];
      }
      let data = { collection: 'tasks', doc: elementCopy };
      console.log('save task, complete data:' + JSON.stringify(data));
      const saveTask$: Observable<Task> = this.http.post<Task>(this.apiBaseUrl + '/upsert', data, httpOptions);
      observables$.push(saveTask$);
    });
    console.log('save done!');
    //FIXME: calrifier car tableau d'Observable<Task> devient vraiment le type de retour Observable<Task[]> un obs contenant tableau de tasks
    //ou un tableau d'observable<Task>
    return combineLatest(observables$);

  }

  saveTask(task: Task): Observable<ResultApiOneTask> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log('save task:' + JSON.stringify(task));
    //HACK to remove $loki property if it's value = 0
    const taskCopy: any = task;
    if (task.$loki == 0) {
      delete taskCopy['$loki'];
    }
    let data = { collection: 'tasks', doc: taskCopy };
    console.log('save task, complete data:' + JSON.stringify(data));
    //const saveTask$:Observable<Task> =

    return this.http.post<ResultApiOneTask>(this.apiBaseUrl + '/upsert', data, httpOptions);

    //return saveTask$;
  }

  listActiveTasks(): Observable<Task[]> {
    console.log('call listTasks');
    return this.http.get<Task[]>(this.apiBaseUrl + '/get/tasks');
    /*.pipe(
      map(data => data.body)
    );*/
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<Task>(this.apiBaseUrl + '/delete/tasks/' + id);
  }


  finishTask() {
    console.log('service finiskTask');
  }


  getStateAt(task: Task, date: number): Mutation {
    //TODO: handle date
    //console.log('getStateAt');
    throw new Error('function is not yet implemented');
    return task.history[0];
    //return {since:'20211006-080011',state:2,zone:1};
  }

  getLastMutation(task: Task): Mutation {
    return task.history[task.history.length - 1];
  }

  extractMetaFromTitle(title: string): Object {
    var infosTitle = title.split(';');
    for (var i = 0; i < infosTitle.length; i++) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' + infosTitle[i]);
    }

    return new Object();



  }


}
