import { exec } from 'child_process';

interface PartitionError {
  error: string;
}

export function getWindowsPartitions(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // 执行命令来获取分区信息
    exec('wmic logicaldisk get caption', (error, stdout, stderr) => {
      if (error) {
        const partitionError: PartitionError = { error: `执行命令时出错: ${error.message}` };
        reject(partitionError.error);
        return;
      }
      
      if (stderr) {
        const partitionError: PartitionError = { error: `命令执行返回错误: ${stderr}` };
        reject(partitionError.error);
        return;
      }

      // 解析输出并构建分区列表
      const partitions = stdout.trim().split('\n');
      const partitionList = partitions.slice(1).map(partition => partition.trim());

      resolve(partitionList);
    });
  });
}

// 从分区读取剩余容量、全部容量
export function getPartitionSpace(partition: string): Promise<{ free: number, total: number }> {
  return new Promise((resolve, reject) => {
    // 执行命令来获取分区信息
    exec(`wmic logicaldisk where caption="${partition}" get FreeSpace,Size`, (error, stdout, stderr) => {
      if (error) {
        const partitionError: PartitionError = { error: `执行命令时出错: ${error.message}` };
        reject(partitionError.error);
        return;
      }
      
      if (stderr) {
        const partitionError: PartitionError = { error: `命令执行返回错误: ${stderr}` };
        reject(partitionError.error);
        return;
      }

      // 解析输出并构建分区列表
      const partitionInfo = stdout.trim().split('\n');
      const partitionSpace = partitionInfo.slice(1).map(partition => partition.trim().split(/\s+/));

      resolve({ free: Number(partitionSpace[0][0]), total: Number(partitionSpace[0][1]) });
    });
  });
}
