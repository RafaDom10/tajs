import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import mapPerson from '../src/person'

describe('Person Test Suite', () => {
    describe('Happy path', () => {
        it('should map person', () => {
            const personMock = {
                name: 'rafael',
                age: 30,
                createdAt: expect.any(Date)
            }
            const personStr = '{"name":"rafael","age":30}'
            const result = mapPerson(personStr)
            expect(result).toEqual(personMock)
        })
    })

    describe('What coverage does not tell you', () => {
        it('should not map person given invalid JSON String', () => {
            const personStr = '{"name":'
            const result = () => mapPerson(personStr) // para casos que estourem erros, encapsular em uma função.
            expect(result).toThrow('Unexpected end of JSON input')
        })

        it('should not map person given invalid JSON String', () => {
            const personMock = {
                name: undefined,
                age: undefined,
                createdAt: expect.any(Date)
            }
            const personStr = '{}'
            const result = mapPerson(personStr) 
            expect(result).toEqual(personMock)
        })
    })

    // ideal validar todos os possiveis erros na func mapPerson, e nao depender apenas do coverage
})