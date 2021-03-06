import {XString} from "../types";

export function get_bit_operation_chunks(left: XString, right: XString): {leftChunk: number, rightChunk: number, chunkLen: number }[] {
  const ret = [];

  let leftFull = left.get();
  const leftLen = leftFull.length;
  leftFull = leftFull.padEnd(Math.ceil(leftLen / 2) * 2, "0");

  let rightFull = right.get();
  const rightLen = rightFull.length;
  rightFull = rightFull.padEnd(Math.ceil(rightLen / 2) * 2, "0");

  const maxLen = leftFull.length > rightFull.length ? leftFull.length : rightFull.length;
    // Using 3-byte chunkgs (6 hex positions) to avoid JavaScript negative values for extreme cases
  const chunks = maxLen / 6;

  for (let pass = chunks; pass > 0; pass--) {
    const chunkStart = maxLen - pass * 6;
    const chunkEnd = maxLen - (pass - 1) * 6;
    let leftSlice = leftFull.slice(chunkStart,chunkEnd);
    let rightSlice = rightFull.slice(chunkStart,chunkEnd);
    const chunkLen = leftSlice.length > rightSlice.length ? leftSlice.length : rightSlice.length;
    leftSlice = leftSlice.padEnd(chunkLen, "0");
    rightSlice = rightSlice.padEnd(chunkLen, "0");
    const leftChunk = parseInt(leftSlice,16);
    const rightChunk = parseInt(rightSlice,16);

    ret.push({leftChunk: leftChunk, rightChunk: rightChunk, chunkLen: chunkLen});
  }

  return ret;
}