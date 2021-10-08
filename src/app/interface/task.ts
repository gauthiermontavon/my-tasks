export interface Task {
  //$loki:number;
  title:string;
  priority:number;
  category:number;
  history:Mutation[]
}

export interface Mutation {
  //Date.toJSON
  since:string;
  //0:new
  //1:en cours
  //2:done
  state:number;
  //0:Archive
  //1:today
  //2:week
  //3:next
  zone:number;


}
