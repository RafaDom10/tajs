import { it, describe, expect, beforeAll, afterAll, jest } from '@jest/globals'

function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => reject(err))
        server.once('listening', () => resolve())
    })
}

describe('E2E Test Suite', () => {
    describe('E2E Test for in a Server a non-test env', () => {
        it('should start serve with PORT 4000', async () => {
            const PORT = 4000
            process.env.NODE_ENV = 'production'
            process.env.PORT = PORT
            jest
                .spyOn(
                    console,
                    console.log.name
                )
            
            const { default: server } = await import('../src/index.js')

            await waitForServerStatus(server)

            const serverInfo = server.address()
            expect(serverInfo.port).toBe(PORT)
            expect(console.log).toHaveBeenCalledWith(
                `server is running at ${serverInfo.address}:${serverInfo.port}`
            )

            return new Promise( resolve => server.close(resolve))
        })
    })

    describe('E2E Tests for Server', () => {
        let _testServer
        let _testServerAddress

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'
            const { default: server } = await import('../src/index.js')
            _testServer = server.listen()

            await waitForServerStatus(_testServer)

            const serverInfo = _testServer.address()
            _testServerAddress = `http://localhost:${serverInfo.port}`
        })

        afterAll( done => _testServer.close(done) )

        it('should return 404 for unsupported routes', async () => {
            const response = await fetch(`${_testServerAddress}/unsupported`, {
                method: 'POST'
            })
            expect(response.status).toBe(404)
        })

        describe('should return 400 and missing field message when body is invalid', () => {
            it('#cpf field', async () => {
                const invalidPerson = {
                    name: 'rafael dom'
                } // cpf missing
                const response = await fetch(`${_testServerAddress}/persons`, {
                    method: 'POST',
                    body: JSON.stringify(invalidPerson)
                })
                expect(response.status).toBe(400)
                const data = await response.json()
                expect(data.validationError).toEqual('CPF is required')
            })
            it('#name field', async () => {
                const invalidPerson = {
                    cpf: '112.112.112-12'
                } // name missing
                const response = await fetch(`${_testServerAddress}/persons`, {
                    method: 'POST',
                    body: JSON.stringify(invalidPerson)
                })
                expect(response.status).toBe(400)
                const data = await response.json()
                expect(data.validationError).toEqual('Name is required')
            })
        })

        
    })

    //TODO: adicionar testes para os casos de success
})