import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TaskService } from "../../api/task.service";
import { Task } from "../../interface/task";
import { ArchivesDataSource } from "./archives-data-source";

@Component({
  selector: 'app-table-archive',
  templateUrl: './table-archive.component.html',
  styleUrls: ['./table-archive.component.css']
})
export class TableArchiveComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'title', 'date'];
  dataSource!: ArchivesDataSource;
  //ne sert à rien
  data: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {

    console.log('init tablearchive!!!!!!!!!!!!!');
    this.dataSource = new ArchivesDataSource(this.taskService);
    this.dataSource.loadArchivesTasks();
  }

  formatDateLastMutation(task: Task): string {
    const since: number = this.taskService.getLastMutation(task).since;
    return new Date(since).toLocaleDateString();
  }

  ngAfterViewInit() {
    //this.paginator.page.pipe(tap(() => this.loadProductsPage())).subscribe();

  }
  /*loadProductsPage() {
    this.dataSource.loadProducts("id", "ASC", this.paginator.pageIndex + 1);
  }
  */

}
