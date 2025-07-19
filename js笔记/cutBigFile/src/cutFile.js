const CHUNK_SIZE = 5 * 1024 * 1024 // 每个分片的大小：5M
const THREAD_COUNT = navigator.hardwareConcurrency || 4 // 线程数量：CPU核心数

/**
 * @description 对文件进行切片
 * @param {File} file 文件
 */
export default async function cutFile(file) {
  return new Promise((resolve) => {
    const result = [] // 线程处理的结果
    let finishCount = 0 // 完成的线程数量
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE) // 分片数量
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT) // 每个线程处理的分片数量
    for (let i = 0; i < THREAD_COUNT; i++) {
      let start = i * threadChunkCount // 起始的分片下标
      let end = Math.min((i + 1) * threadChunkCount, chunkCount) // 结束的分片下标
      // 给每个线程分配任务
      const worker = new Worker('./worker.js')
      worker.postMessage({
        file,
        start,
        end,
        CHUNK_SIZE,
      })
      worker.onmessage = (e) => {
        worker.terminate()
        result[i] = e.data // 接收每个线程的处理结果
        finishCount++
        if (finishCount === THREAD_COUNT) {
          resolve(result.flat())
        }
      }
    }
  })
}
