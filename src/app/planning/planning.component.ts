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

  @ViewChild(MatMenuTrigger) rightMenu!: MatMenuTrigger;

   today : Task[] = [
    {
      id:1,
      title:'Get to work',
      priority:1,
      category:1,
      history:[
        {since:'',zone:1,state:0}
      ]
    },
    {
      id:2,
      title:'Pick up groceries',
      priority:1,
      category:1,
      history:[
        {since:'',zone:1,state:0}
      ]
    },
    {
      id:3,
      title:'Go home',
      priority:1,
      category:1,
      history:[
        {since:'',zone:1,state:0}
      ]
    },
    {
      id:4,
      title:'Fall asleep',
      priority:1,
      category:1,
      history:[
        {since:'',zone:1,state:0}
      ]
    }
  ];

  week = [
   'Get up',
   'Brush teeth',
   'Take a shower',
   'Check e-mail',
   'Walk dog'
  ];

  next = [
    'Complete your todolist',
    'Get all tasks done'
  ];
  constructor(private taskService:TaskService) { }

  ngOnInit(): void {
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

 saveTask(list:string,event:any){
   console.log('press enter on new task');
 }

 openRightMenu(event:any){
   event.preventDefault();
   console.log('right menu open');
   this.rightMenu.openMenu();
 }

 clickOnTask(event:any){
   console.log('test');
   this.rightMenu.closeMenu();

   //event.stopPropagation();
    //event.preventDefault();
 }

 setTaskDone(id:number,done:boolean){
   console.log('this.today:'+JSON.stringify(this.today));
   /*let task:Task = this.today.find(obj => obj.id == id);

   let mutation:Mutation = this.taskService.getStateAt(task,Date.now());
   if(done){mutation.state = 2}
   else{mutation.state = 0 };

   task.history[0] = mutation;*/

   console.log('task checked:'+done);
 }

 isTaskDone(task:Task):boolean{

    let mutation:Mutation = this.taskService.getStateAt(task,Date.now());
    let returnVal = mutation.state==2?true:false;
    console.log('isTaskDone:'+returnVal);
    return mutation.state==2?true:false;
 }



}
