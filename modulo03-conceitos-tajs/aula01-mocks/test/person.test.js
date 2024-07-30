import { describe, it, expect, jest } from '@jest/globals'
import Person from '../src/person'

describe('#Person Suite', () => {
    describe('#validate', () => {
        it('should throw if the name is not present', () => {
            // mock entrada necessaria para que o test funcione
            const mockInvalidPerson = {
                name: '',
                cpf: '111.111.111-11'
            }

            const result = () => Person.validate(mockInvalidPerson)

            expect(result).toThrow(new Error('Name is required'))
        })

        it('should throw if the cpf is not present', () => {
            const mockInvalidPerson = {
                name: 'Rafael',
                cpf: ''
            }
            const result = () => Person.validate(mockInvalidPerson)

            expect(result).toThrow(new Error('CPF is required'))
        })

        it('should not throw if person is valid', () => {
            const mockInvalidPerson = {
                name: 'Rafael',
                cpf: '111.111.111-11'
            }
            const result = () => Person.validate(mockInvalidPerson)

            expect(result).not.toThrow()
        })
    })

    describe('#format', () => {
        it('should format the person name and cpf', () => {
            // AAA
            // Arrange - Preparar
            const mockPerson = {
                name: 'Rafael Domingues',
                cpf: '111.111.111-11'
            }
            //Act - Executar
            const formattedPerson = Person.format(mockPerson)
            // Assert - Validar
            const expected = {
                name: 'Rafael',
                lastName: 'Domingues',
                cpf: '11111111111'
            }
            expect(formattedPerson).toStrictEqual(expected)
        })
    })

    describe('#save', () => {
        it('should throw if person not contain name prop ', () => {
            const mockPersonWithoutName = {
                lastName: 'Last Name',
                cpf: '11111111111'
            }

            const result = () => Person.save(mockPersonWithoutName)

            expect(result)
                .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockPersonWithoutName)}`))

        })
        it('should throw if person not contain lastName prop ', () => {
            const mockPersonWithoutLastName = {
                name: 'Name',
                cpf: '11111111111'
            }

            const result = () => Person.save(mockPersonWithoutLastName)

            expect(result)
                .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockPersonWithoutLastName)}`))

        })
        it('should throw if person not contain cpf prop ', () => {
            const mockPersonWithoutCpf = {
                name: 'Name',
                lastName: 'Last Name'
            }

            const result = () => Person.save(mockPersonWithoutCpf)

            expect(result)
                .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockPersonWithoutCpf)}`))

        })
        it('should not throw if person contain all props ', () => {
            const mockPerson = {
                name: 'Name',
                lastName: 'Last Name',
                cpf: '11111111111'
            }

            const result = () => Person.save(mockPerson)

            expect(result).toBeTruthy()
        })
    })

    describe('#process', () => {
        it('should process a valid person', () => {

            const mockPerson = {
                name: 'Rafael Domingues',
                cpf: '111.111.111-11'
            }

            jest.spyOn(
                Person,
                Person.validate.name
            ).mockReturnValue()

            jest.spyOn(
                Person,
                Person.format.name
            ).mockReturnValue({
                cpf: '11111111111',
                name: 'Rafael',
                lastName: 'Domingues Antonio'
            })

            const result = Person.process(mockPerson)
            const expected = 'ok'
            expect(result).toStrictEqual(expected)
        })
    })
})