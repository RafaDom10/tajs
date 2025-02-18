import { it, expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach } from '@jest/globals'
import { server } from '../src/api.js'

/**
 * - Deve cadastrar usuarios e definir uma categoria onde:
 *  - Jovens adultos:
 *      - Usuarios de 18-25 anos
 *  - Adultos:
 *      - Usuarios de 26-50 anos
 *  - Idosos:
 *      - 51+
 *  - Menor:
 *      - Estoura um erro
 */

describe('API Users E2E Suite', () => {

    function waitForServerStatus(server) {
        return new Promise((resolve, reject) => {
            server.once('error', (err) => reject(err))
            server.once('listening', () => resolve())
        })
    }

    function createUser(data) {
        return fetch(`${_testServerAddress}/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    async function findUserById(id) {
        const user = await fetch(`${_testServerAddress}/users/${id}`)
        return user.json();
    }

    let _testServer
    let _testServerAddress

    beforeAll(async () => {
        _testServer = server.listen()

        await waitForServerStatus(_testServer)

        const serverInfo = _testServer.address()
        _testServerAddress = `http://localhost:${serverInfo.port}`
    })

    afterAll(done => {
        server.closeAllConnections();
        _testServer.close(done);
    });

    beforeEach(() => {
        //* sempre mockar o tempo quando estiver trabalhando com datas
        jest.useFakeTimers({
            now: new Date('2025-02-18T00:00')
        });
    });

    afterEach(() => {
        //* afterEach é necessário para garantir que cada teste comece com um ambiente limpo, sem interferências de mocks de tempo anteriores.
        jest.useRealTimers();
    });

    it('should register a new user with young-adult category', async () => {
        const expectedCategory = 'young-adult';
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '2002-01-01'
        })
        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.id).not.toBeUndefined();

        const user = await findUserById(result.id);
        expect(user.category).toBe(expectedCategory)
    });

    it('should register a new user with adult category', async () => {
        const expectedCategory = 'adult';
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '1991-01-01'
        })
        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.id).not.toBeUndefined();

        const user = await findUserById(result.id);
        expect(user.category).toBe(expectedCategory)
    });

    it('should register a new user with senior category', async () => {
        const expectedCategory = 'senior';
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '1940-01-01'
        })
        expect(response.status).toBe(201);
        const result = await response.json();
        expect(result.id).not.toBeUndefined();

        const user = await findUserById(result.id);
        expect(user.category).toBe(expectedCategory)
    });

    it('should throw an error when registering a under-age user', async () => {
        const response = await createUser({
            name: 'Xuxa da Silva',
            birthDay: '2020-01-01'
        });

        expect(response.status).toBe(400);

        const result = await response.json();
        expect(result).toEqual({
            message: 'User must be 18yo or older'
        })
    });
})