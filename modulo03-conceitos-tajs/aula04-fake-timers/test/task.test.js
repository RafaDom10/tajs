import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import Task from '../src/task.js'
import { setTimeout } from 'node:timers/promises'

describe('Task Test Suite', () => {
    let _logMock 
    let _task
    beforeEach(() => {
        _logMock = jest.spyOn(
            console,
            console.log.name
        ).mockImplementation()

        _task = new Task()
    })

    it.skip('should only run tasks that are due without fake timers (slow)', async () => {        
        // Arrange
        const tasks = [
            { 
                name: 'Task-will-run-in-5-sec', 
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            { 
                name: 'Task-will-run-in-10-sec', 
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            }
        ]
        // Act
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        _task.run(200)

        await setTimeout(11000)

        // Assert
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()
    },
    15000
    )

    it('should only run tasks that are due with fake timers (fast)', async () => {   
        jest.useFakeTimers()     
        // Arrange
        const tasks = [
            { 
                name: 'Task-will-run-in-5-sec', 
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            { 
                name: 'Task-will-run-in-10-sec', 
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            }
        ]
        // Act
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        _task.run(200)

        // Assert

        // 4 sec - nenhuma task deve ser executada
        jest.advanceTimersByTime(4000)
        expect(tasks.at(0).fn).not.toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // 4 + 2 = 6 sec - apenas a primeira task deve ser executada
        jest.advanceTimersByTime(2000)
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // 4 + 2 + 4 = 10 sec - as duas tasks devem ser executadas
        jest.advanceTimersByTime(4000)
        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()

        jest.useRealTimers()
    })
})