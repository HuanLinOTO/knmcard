package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"
	"time"
)

var copiedBytes int64
var totalBytes int64
var startTime time.Time

type copyTask struct {
	src string
	dst string
}

func main() {
	// 解析命令行参数
	var goroutines int
	var refersh_interval int
	var srcDir, dstDir string
	flag.IntVar(&goroutines, "workers", 10, "number of workers")
	flag.StringVar(&srcDir, "src", "", "src directory")
	flag.StringVar(&dstDir, "dst", "", "destination directory")
	flag.IntVar(&refersh_interval, "rfs", 200, "refersh interval")
	flag.Parse()

	// 判定参数是否合法
	if goroutines <= 0 {
		fmt.Println("goroutines must be greater than 0")
		os.Exit(1)
	}

	if srcDir == "" {
		fmt.Println("src directory must be specified")
		os.Exit(1)
	}

	if dstDir == "" {
		fmt.Println("destination directory must be specified")
		os.Exit(1)
	}

	// 首先计算总字节数
	err := filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			atomic.AddInt64(&totalBytes, info.Size())
		}

		return nil
	})

	if err != nil {
		panic(err)
	}

	startTime = time.Now()

	go func() {
		for {
			time.Sleep(time.Duration(refersh_interval) * time.Millisecond)
			copied := atomic.LoadInt64(&copiedBytes)
			total := atomic.LoadInt64(&totalBytes)
			elapsed := time.Since(startTime).Seconds()
			speed := float64(copied) / elapsed
			fmt.Printf("%d,%d,%.2f\n", copied, total, speed)
		}
	}()

	// 创建一个工作池
	tasks := make(chan copyTask, 100)
	wg := &sync.WaitGroup{}

	// 启动指定数量的工作goroutine
	for i := 0; i < goroutines; i++ {
		go worker(tasks, wg)
	}

	// 然后复制文件
	err = filepath.Walk(srcDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(srcDir, path)
		if err != nil {
			return err
		}

		dstPath := filepath.Join(dstDir, relPath)

		if info.IsDir() {
			return os.MkdirAll(dstPath, info.Mode())
		}

		wg.Add(1)
		tasks <- copyTask{src: path, dst: dstPath}

		return nil
	})

	if err != nil {
		panic(err)
	}

	close(tasks)
	wg.Wait()

	copied := atomic.LoadInt64(&copiedBytes)
	total := atomic.LoadInt64(&totalBytes)
	elapsed := time.Since(startTime).Seconds()
	speed := float64(copied) / elapsed
	fmt.Printf("%d,%d,%.2f\n", copied, total, speed)
}

func worker(tasks chan copyTask, wg *sync.WaitGroup) {
	for task := range tasks {
		copied, err := copyFile(task.src, task.dst)
		if err == nil {
			atomic.AddInt64(&copiedBytes, copied)
		}
		wg.Done()
	}
}

func copyFile(src, dst string) (int64, error) {
	in, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer out.Close()

	return io.Copy(out, in)
}
