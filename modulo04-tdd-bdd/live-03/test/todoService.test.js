const { describe, it, before, afterEach, after } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')
const uuid = require('uuid')

const TodoService = require('../src/todoService')
const Todo = require('../src/todo')

describe('todoService', () => {
    let sandbox
    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('#list', () => {
        const mockDataBase = [
            {
                name: 'xuxa da silva',
                age: 90,
                meta: { revision: 0, created: 1740004596283, version: 0 },
                '$loki': 1
            }
        ]

        let todoService
        beforeEach(() => {
            const dependencies = {
                todoRepository: {
                    list: sandbox.stub().returns(mockDataBase)
                }
            }

            todoService = new TodoService(dependencies)
        })

        it('should return data on a specific format', () => {
            const result = todoService.list()
            const [{ meta, $loki, ...expected }] = mockDataBase
            expect(result).to.be.deep.equal([expected])
        })
    })

    describe('#create', () => {
        let todoService
        beforeEach(() => {
            const dependencies = {
                todoRepository: {
                    create: sandbox.stub().returns(true)
                }
            }

            todoService = new TodoService(dependencies)
        })



        it("shouldn't save todo item with invalid data", () => {
            const data = new Todo({
                text: '',
                when: ''
            })
            //* melhor para a performance do que o simples delete
            Reflect.deleteProperty(data, 'id')
            const expected = {
                error: {
                    message: 'invalid data',
                    data: data
                }
            }
            const result = todoService.create(data)
            expect(result).to.be.deep.equal(expected)
        })

        it("should save todo item with late status when the property is further than today", () => {
            const properties = {
                text: 'Lavar o carro',
                when: new Date("2025-02-20 12:00:00 GMT-0")
            }
            const expectedId = '000001'
            sandbox.stub(uuid, "v4").returns(expectedId)

            const data = new Todo(properties)

            const today = new Date("2025-02-21")
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expectedCallWith = {
                ...data,
                status: 'late'
            }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
        })

        it("should save todo item with pending status", () => {
            const properties = {
                text: 'Lavar o carro',
                when: new Date("2025-02-22 12:00:00 GMT-0")
            }
            const expectedId = '000001'
            sandbox.stub(uuid, "v4").returns(expectedId)

            const data = new Todo(properties)

            const today = new Date("2025-02-21")
            sandbox.useFakeTimers(today.getTime())

            todoService.create(data)

            const expectedCallWith = {
                ...data,
                status: 'pending'
            }

            expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
        })
    })
})