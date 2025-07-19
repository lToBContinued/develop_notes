/**
 * @description 创建分片
 * @param {File} file 文件
 * @param {number} index 分片的下标
 * @param {number} chunkSize 分片的大小
 */
export default function createChunk(file, index, chunkSize) {
  return new Promise((resolve) => {
    const start = index * chunkSize
    const end = start + chunkSize
    const spark = new SparkMD5.ArrayBuffer() // 生成一个哈希对象
    const fileReader = new FileReader()
    const blob = file.slice(start, end)
    fileReader.onload = (e) => {
      spark.append(e.target.result)
      resolve({
        start,
        end,
        index,
        hash: spark.end(),
        blob,
      })
    }
    fileReader.readAsArrayBuffer(blob)
  })
}
