import * as fs from 'fs/promises';

import { spawn, ChildProcessWithoutNullStreams  } from 'child_process'

export type Task = {
  taskid: string;
  processed: number;
  total: number;
  speed: number;
  src: string;
  dst: string;
}

export class FileCopyTaskManager {

  public tasks: Record<string, Task & { process: ChildProcessWithoutNullStreams }> = {};

  constructor() {
  }

  getUpdateTaskFunc(taskid: string) {
    return (data: Buffer) => {
      const str = data.toString();
      const lines = str.split('\n');
      for (const line of lines) {
        const [processed, total, speed] = line.split(',');
        // console.log(processed, total, speed);
        if (!processed || !total || !speed) {
          continue;
        }
        
        const task = this.tasks[taskid];
        if (task) {
          task.processed = parseInt(processed);
          task.total = parseInt(total);
          task.speed = parseInt(speed);
        }
      }
    }
  }

  async addTask(inputFolder: string, outputFolder: string, options: {
    hash: boolean,
    useShotNow: boolean,
    shotnow: any
  }): Promise<Task> {
    console.log("addTask", inputFolder, outputFolder, options);
    
    const taskid = Math.random().toString(36).substring(7);
    const process = spawn('go/copy',["--workers", "4", "--src", inputFolder, "--dst", outputFolder, "--rfs", "200"]);
    const task = {
      taskid,
      processed: 0,
      total: 0,
      speed: 0,
      src: inputFolder,
      dst: outputFolder,
    }
    process.stdout.on('data', this.getUpdateTaskFunc(taskid))
    this.tasks[taskid] = {
      ...task,
      process
    };
    return task;
  }

  async checkTask(taskId: string): Promise<Task> {
    return {
      taskid: this.tasks[taskId].taskid,
      processed: this.tasks[taskId].processed,
      total: this.tasks[taskId].total,
      speed: this.tasks[taskId].speed,
      src: this.tasks[taskId].src,
      dst: this.tasks[taskId].dst,
    };
  }
}
