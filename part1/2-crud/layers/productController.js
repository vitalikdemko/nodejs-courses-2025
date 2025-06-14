let products = []

const getProducts = (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(products))
  }
}

const addProduct = (req, res, body) => {
  if (req.method === "POST") {
    try {
      const item = JSON.parse(body)
      item.id = Date.now()
      products.push(item)
      res.statusCode = 201
      res.end(JSON.stringify(item))
    } catch (e) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: "Invalid JSON" }))
    }
  }
}

const updateProduct = (req, res, body, id) => {
  if (req.method === "PUT") {
    const _id = parseInt(id)
    const index = products.findIndex((i) => i.id === _id)
    if (index === -1) {
      res.statusCode = 404
      res.end(JSON.stringify({ error: "Product not found" }))
    }

    try {
      const updatedItem = JSON.parse(body)
      updatedItem.id = _id
      products[index] = updatedItem
      res.end(JSON.stringify(updatedItem))
    } catch (e) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: "Invalid JSON" }))
    }
  }
}

const deleteProduct = (req, res, id) => {
  if (req.method === "DELETE") {
    const _id = parseInt(id)
    const index = products.findIndex((i) => i.id === _id)
    if (index === -1) {
      res.statusCode = 404
      res.end(JSON.stringify({ error: "Product not found" }))
    }
    const deleted = products.splice(index, 1)
    res.end(JSON.stringify(deleted[0]))
  }
}

const productController = {
  add: addProduct,
  getAll:getProducts,
  update: updateProduct,
  delete: deleteProduct
}

export default productController