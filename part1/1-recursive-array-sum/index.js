
import { recursiveNestedArraySum } from "./recursiveNestedArraySum.js"

const main = () => {
  const input = process.argv[2]

  if (!input || typeof input !== "string") {
    console.error('Input error. Example: "[1, 2, [3, 4, [5]], 6]"')
    process.exit()
  }

  try {
    const parsed = JSON.parse(input);
    const result = recursiveNestedArraySum(parsed)
    console.log("result:", result);
  } catch (e) {
    console.error("Unhandled error:", e.message)
  }
}

main()

// cd 1-recursive-array-sum
// node index.js "[1, 2, [3, 4, [5]], 6]