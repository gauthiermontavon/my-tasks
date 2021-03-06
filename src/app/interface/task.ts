export interface Task {
  $loki: number;
  title: string;
  description?: string;
  priority: number;
  category: number;
  history: Mutation[]
}

export interface Mutation {
  //Date.toJSON
  since: number;
  //0:new
  //1:en cours
  //2:done
  state: number;
  //0:Archive
  //1:today
  //2:week
  //3:next
  zone: number;
}

export interface ResultApiOneTask {
  message: string,
  doc: Task;
}
