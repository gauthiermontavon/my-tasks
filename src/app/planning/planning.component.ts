import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material/button-toggle';
import { Task, Mutation } from '../interface/task';
import { TaskService } from '../api/task.service';




@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  today: Task[] = [];
  week: Task[] = [];
  next: Task[] = [];
  newTaskTodayTitle = 'Nouvelle tâche';
  newTaskWeekTitle = 'Nouvelle tâche';
  newTaskNextTitle = 'Nouvelle tâche';


  //archives: Task[] = [{ "title": "Nouvelle tâche #1", "priority": 1, "category": 1, "history": [{ "since": "", "zone": 0, "state": 0 }], "$loki": 1 }];

  constructor(private _bottomSheet: MatBottomSheet, private taskService: TaskService) { }

  openBottomSheet(task: Task): void {
    this._bottomSheet.open(BottomSheetContextMenuComponent, { panelClass: 'bottom-sheet', data: task })
      .afterDismissed().subscribe((dataFromSheet) => {
        console.log('data from sheet:' + JSON.stringify(dataFromSheet));
        if (dataFromSheet == null) {
          console.log('bottom close by escape key');
        }
        else if (dataFromSheet.command == 'del') {
          console.log('delete task');
          this.taskService.deleteTask((dataFromSheet.task as Task).$loki).subscribe({
            next: data => {
              //this.status = 'Delete successful';
              console.log('successful delete');
              if (this.taskService.getLastMutation(task).zone == 1) {
                this.removeTaskFromList(this.today, task);
              } else if (this.taskService.getLastMutation(task).zone == 2) {
                this.removeTaskFromList(this.week, task);
              } else if (this.taskService.getLastMutation(task).zone == 3)
                this.removeTaskFromList(this.next, task);
            },
            error: error => {
              //this.errorMessage = error.message;
              console.error('There was an error!', error);
            }
          });
        }
        else if (dataFromSheet.command == 'upd') {
          this.taskService.saveTask(dataFromSheet.task as Task).subscribe(result => {
            console.log('task was saved ! :' + JSON.stringify(result));

          });
        }
      });

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('afterview init');
    this.taskService.listActiveTasks().subscribe(results => {
      console.log('results list !!' + JSON.stringify(results));
      results.forEach(result => {

        let currentZone = this.taskService.getLastMutation(result as Task).zone;

        if (currentZone == 1) {
          this.today.push(result as Task);
          //this.today = results as Task[];
        }
        if (currentZone == 2) {
          this.week.push(result as Task);
        }
        if (currentZone == 3) {
          this.next.push(result as Task);
        }
      })
      //FIXME : génère des doublons....
      //this.today = results as Task[];
      //this.taskService.setActiveTasks(results as Task[]);
    });

  }

  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      console.log('nothing to do...change order when implementation has been done');
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {


      console.log('call moveTask API:' + event.previousIndex);
      let taskToMove: Task = event.previousContainer.data[event.previousIndex];
      let zoneDest = event.container.data[0].history[0].zone;
      console.log('call moveTask API:' + JSON.stringify(taskToMove));

      taskToMove.history[0].zone = zoneDest;
      //TODO:manage Mutation
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      this.taskService.saveTask(taskToMove).subscribe(result => {

        console.log('moved task was saved ! :' + JSON.stringify(result));


      });

    }
  }

  newTask(zone: number, event: Event) {
    console.log('press enter on new task, zone:' + zone);
    let title = '';
    if (zone == 1) { title = this.newTaskTodayTitle; }
    if (zone == 2) { title = this.newTaskWeekTitle; }
    if (zone == 3) { title = this.newTaskNextTitle; }
    //let title = (event.target as HTMLElement).textContent;
    let meta = null;
    if (title == null) { title = 'TITRE NON DEFINI'; }
    else {
      meta = this.taskService.extractMetaFromTitle(title);
    }
    console.log('meta ?:' + JSON.stringify(meta));
    const taskToAdd = {
      $loki: 0,
      title: title.toString(),
      priority: 3,
      category: 0,
      history: [
        { since: 0, zone: zone, state: 0 }
      ]
    };

    if (zone == 1) {

      this.taskService.saveTask(taskToAdd).subscribe(result => {
        //attention property $loki est effacé dans saveTask, pour faire appel à upsert
        taskToAdd['$loki'] = result.doc.$loki;
        console.log(' task was created ! $loki :' + result.doc.$loki);
        console.log(' task was created ! original task :' + JSON.stringify(taskToAdd));
        console.log(' task was created ! :' + JSON.stringify(result));
        this.today.push(taskToAdd);
        this.newTaskTodayTitle = 'Nouvelle tâche';

      });

    }
    if (zone == 2) {

      this.taskService.saveTask(taskToAdd).subscribe(result => {
        taskToAdd['$loki'] = result.doc.$loki;
        console.log(' task was created ! :' + JSON.stringify(result));
        this.week.push(taskToAdd);
        this.newTaskWeekTitle = 'Nouvelle tâche';

      });

    }
    if (zone == 3) {

      this.taskService.saveTask(taskToAdd).subscribe(result => {
        taskToAdd['$loki'] = result.doc.$loki;
        console.log(' task was created ! :' + JSON.stringify(result));
        this.next.push(taskToAdd);
        this.newTaskNextTitle = 'Nouvelle tâche';

      });

    }
  }

  setTaskDone(id: number, $event: any) {
    //console.log('setTaskDone id:' + id);
    //$event.stopPropagation();
    const done = $event.checked;
    console.log('this.today:' + JSON.stringify(this.today));
    const taskResult = this.today.find(obj => obj.$loki === id);
    if (taskResult) {
      console.log('task obj;' + JSON.stringify(taskResult));
      let mutation: Mutation = taskResult.history[0];
      if (done) { mutation.state = 2 }
      else { mutation.state = 0 };
      taskResult.history[0] = mutation;

      //TODO:since
      this.taskService.saveTask(taskResult).subscribe(result => {

        console.log('moved task was saved ! :' + JSON.stringify(result));

      });
    }
    console.log('task checked:' + done);
  }

  isTaskDone(task: Task): boolean {
    let mutation: Mutation = task.history[0];
    let returnVal = mutation.state == 2 ? true : false;
    //console.log('isTaskDone:' + returnVal);
    return mutation.state == 2 ? true : false;
  }

  archiveTask(task: Task) {
    console.log('archiveTask today after: ' + JSON.stringify(this.today));
    //let mutation: Mutation = this.taskService.getStateAt(task, Date.now());
    let mutation: Mutation = { zone: 0, since: Date.now(), state: 2 };
    task.history.push(mutation);
    //TODO:since
    this.taskService.saveTask(task).subscribe(result => {
      console.log('archive task was saved ! :' + JSON.stringify(result));
      this.removeTaskFromList(this.today, task);
    });
  }

  private removeTaskFromList(list: Task[], taskToRemove: Task) {
    list.forEach((obj, index) => {
      if (obj.$loki == taskToRemove.$loki) {
        list.splice(index, 1);
      }
    });
  }

  classCategoryandPriority(task: Task): string {

    let category: number = task.category;
    let priority: number = task.priority;

    let returnClass = "";

    if (category != undefined) {
      returnClass = "cat-" + category.toString() + "-color";
    } else {
      returnClass = "";
    }

    if (priority != undefined) {
      returnClass = returnClass + " priority-" + priority.toString();
    } else {
      returnClass = returnClass + "";
    }
    //console.log('class for task (' + task.priority + ') ' + task.title + ' is:' + returnClass);
    return returnClass;



  }

}

@Component({
  selector: 'bottom-sheet-context-menu',
  templateUrl: './bottom-sheet-context-menu.html',
  styleUrls: ['./bottom-sheet-context-menu.css']
})
export class BottomSheetContextMenuComponent {

  public currentTask: Task;

  //currentCategory = '1';
  //currentPriority = '2';

  @ViewChild('groupCategory') groupCat!: MatButtonToggleGroup;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<BottomSheetContextMenuComponent>) {
    this.currentTask = data as Task;
  }

  close(cmd: string, event: MouseEvent): void {
    this._bottomSheetRef.dismiss({ command: cmd, task: this.currentTask });
    event.preventDefault();
  }

  enableTitle() {

  }

  ngAfterViewInit(): void {
    console.log('after view bottom:' + JSON.stringify(this.data));
  }

  toggleCategory(event: any) {
    console.log('category change:' + event.value);
    this.currentTask.category = event.value;
  }

  togglePriority(event: any) {
    console.log('priority change:' + event.value);
    this.currentTask.priority = event.value;
  }

}
