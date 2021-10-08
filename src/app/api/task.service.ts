import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import {Task,Mutation} from '../interface/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks:Task[] = [];

  private apiBaseUrl = 'http://localhost:20800';
  constructor(private http: HttpClient) { }


  saveActiveTasks(){

  }
  archiveTasks(id:number){

  }

  listTasks():Observable<Task[]>{
    console.log('call listTasks');
    return this.http.get<Task[]>(this.apiBaseUrl+'/get/tasks');
    /*.pipe(
      map(data => data.body)
    );*/
  }
  //
  addTask(task:Task){
    this.tasks.push(task);
  }

  finishTask(){
    console.log('service finiskTask');
  }

  moveTask(to:string){
    console.log('service moveTask to...');
  }

  getStateAt(task:Task,date:number):Mutation{
    //TODO: handle date
    //console.log('getStateAt');

    return task.history[0];
    //return {since:'20211006-080011',state:2,zone:1};
  }




  getLastMutation(task:Task):Mutation{
      return {since:'20211006-080011',state:2,zone:1};
  }


}
