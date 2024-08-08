import { createServer } from 'node:http'

const server = createServer(async (request, response) => {
    response.end('ok')
})

export default server