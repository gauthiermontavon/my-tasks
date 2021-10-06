import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';

import {Task,Mutation} from '../interface/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  addTask(){
    console.log('api call - addTask');
  }

  finishTask(){
    console.log('api call - finiskTask');
  }

  moveTask(to:string){
    console.log('api call - moveTask to...');
  }

  getStateAt(task:Task,date:number):Mutation{
    //TODO: handle task and date
    console.log('getStateAt');
    return {since:'20211006-080011',state:2,zone:1};
  }


}
