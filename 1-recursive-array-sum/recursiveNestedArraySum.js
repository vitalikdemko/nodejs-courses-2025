export const recursiveNestedArraySum = (nestedNumberArray) => {

 if(!Array.isArray(nestedNumberArray)) return nestedNumberArray
 
  let sum = 0;

  for (const item of nestedNumberArray) {
    if (Array.isArray(item) && item.length > 0) {
      sum += recursiveNestedArraySum(item)
    } else {
      sum += item
    }
  }

  return sum
}