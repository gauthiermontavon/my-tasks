import { Component, OnInit, ViewChild } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';
import {Task,Mutation} from '../interface/task';
import {TaskService} from '../api/task.service';


@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  today:Task[]=[];

  constructor(private taskService:TaskService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    console.log('afterview init')
    this.taskService.listTasks().subscribe(results => {
      console.log('results list !!');
    });

  }

 drop(event: CdkDragDrop<Task[]>) {
   if (event.previousContainer === event.container) {
     console.log('nothing to do...');
     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
   } else {
     transferArrayItem(event.previousContainer.data,
                       event.container.data,
                       event.previousIndex,
                       event.currentIndex);
    console.log('call moveTask API');
   }
 }

 saveTask(zone:number,event:Event){
   console.log('press enter on new task'+(event.target as HTMLElement).textContent);
   const title = (event.target as HTMLElement).textContent;
   const taskToAdd = {
     title:title,
     priority:1,
     category:1,
     history:[
       {since:'',zone:zone,state:0}
     ]
   };
   this.taskService.addTask(taskToAdd):

 }


 setTaskDone(id:number,done:boolean){
   console.log('setTaskDone id:'+id);
   console.log('this.today:'+JSON.stringify(this.today));
   const taskResult = this.today.find(obj => obj.$loki === id);
   if(taskResult){
     console.log('task obj;'+JSON.stringify(taskResult));
     let mutation:Mutation = this.taskService.getStateAt(taskResult,Date.now());
     if(done){mutation.state = 2}
     else{mutation.state = 0 };
     taskResult.history[0] = mutation;
  }
  console.log('task checked:'+done);
 }

 isTaskDone(task:Task):boolean{
    let mutation:Mutation = this.taskService.getStateAt(task,Date.now());
    let returnVal = mutation.state==2?true:false;
    console.log('isTaskDone:'+returnVal);
    return mutation.state==2?true:false;
 }



}
