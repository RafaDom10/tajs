const { describe, it } = require('mocha')
const { expect } = require('chai')
const { createSandbox } = require('sinon')
const uuid = require('uuid')

const Todo = require('../src/todo')

describe('todo', () => {
    let sandbox
    beforeEach(() => {
        sandbox = createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('#isValid', () => {
        it('should return invalid when creating an object without text', () => {
            const data = {
                text: '',
                when: new Date("2025-02-19")
            }
            const todo = new Todo(data)
            const result = todo.isValid()
            expect(result).to.be.not.ok
        })
        it('should return invalid when creating an object using "when" property invalid', () => {
            const data = {
                text: 'Hello world',
                when: new Date("20-02-19")
            }
            const todo = new Todo(data)
            const result = todo.isValid()
            expect(result).to.be.not.ok
        })
        it('should have "id", "text", "when" and "status" properties after creating object', () => {
            const data = {
                text: 'Hello world',
                when: new Date("2025-02-19")
            }
            const expectedId = '000001'
            sandbox.stub(uuid, "v4").returns(expectedId)

            const todo = new Todo(data)
            const expectedItem = {
                text: data.text,
                when: data.when,
                status: '',
                id: expectedId
            }
            const result = todo.isValid()

            expect(result).to.be.ok
            expect({ ...todo, id: expectedId }).to.be.deep.equal(expectedItem)
        })
    })
})