const crypto = require('crypto')
const fs = require('fs')

function calculateBlocks(data) {
  const blockSize = 1024
  const blocks = Math.ceil(data.length / blockSize)

  const blocksArray = []

  let newIndex = 0
  let j = 0

  for (let i = 0; i < blocks; i++) {
    let block = []
    for (j = 0; j < blockSize; j++) {
      if (data[newIndex + j] !== undefined) {
        block.push(data[newIndex + j])
      }
    }
    newIndex = newIndex + j
    blocksArray.push(block)
  }

  return blocksArray
}

function calculateHash(block) {
  const buffer = Buffer.from(block)
  const hash = crypto.createHash('sha256').update(buffer)

  return hash
}

function calculateHashes(blocks) {
  const reversedBlocks = blocks.reverse()

  const hashBlocks = []
  // CONSOLE ERROR: The "list[0]" argument must be an instance of Buffer or Uint8Array. Received an instance of Hash
  hashBlocks.push(calculateHash(reversedBlocks[0]))

  for (let i = 1; i < reversedBlocks.length; i++) {
    const nextBuffer = Buffer.from(reversedBlocks[i])
    const nextBlock = Buffer.concat([nextBuffer, hashBlocks[i - 1].digest()])

    hashBlocks.push(calculateHash(nextBlock))
  }

  return hashBlocks[hashBlocks.length - 1].digest('hex')
}

function run() {
  try {
    const data = fs.readFileSync('./src/videos/FuncoesResumo - SHA1.mp4')

    const blocks = calculateBlocks(data)

    console.log(calculateHashes(blocks))
  } catch (err) {
    console.error(err)
  }
}

run()
