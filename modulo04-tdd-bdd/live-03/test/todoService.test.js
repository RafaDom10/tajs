const { describe, it, before, afterEach } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')

const TodoService = require('../src/todoService')

describe('todoService', () => {
    let sandbox
    before(() => {
        sandbox = createSandbox()
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
            // 1:04:00
        })
        it("should save todo item with late status when the property is further than today")
        it("should save todo item with pending status")
    })
})