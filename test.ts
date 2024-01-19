import { FileCopyTask } from './src/backend/utils/copy';

const obj = new FileCopyTask();
(async () => {
  const task = await obj.addTask('D:/元旦晚会/照片_A7R5_后右方定点_刘明远', 'D:/元旦晚会/照片_A7R5_后右方定点_刘明远2')
  setInterval(async () => {
    const tk = await obj.checkTask(task.taskid);
    console.log(tk);
  }, 200)
})()