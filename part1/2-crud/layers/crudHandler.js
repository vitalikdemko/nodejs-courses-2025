import { parse } from 'url'
import productController from "./productController.js"

export const crudHandler = (req, res) => {
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl

  let controller = null

  if(pathname === '/products') {
    controller = productController
  } else {
    res.statusCode = 404
    res.end('Not found')
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json')

    if (req.method === 'GET') {
        return controller.getAll(req, res)
    }

    if (req.method === 'POST') {
        return controller.add(req, res, body)
    }

    if (req.method === 'PUT') {
        return controller.update(req, res, body, query.id)
    }

    if (req.method === 'DELETE') {
        return controller.delete(req, res, query.id)
    }

    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not found' }))
  })
}

export default crudHandler