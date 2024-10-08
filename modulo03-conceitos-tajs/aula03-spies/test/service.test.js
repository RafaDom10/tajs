import { it, describe, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import crypto from "node:crypto"
import fs from "node:fs/promises"

describe('Service Test Suite', () => {
    let _service
    const filename = 'testFile.ndjson'
    const MOCKED_HASH_PWD = 'hashedpassword'

    beforeEach(() => {
        jest.spyOn(
            crypto,
            crypto.createHash.name
        ).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
        })

        jest.spyOn(
            fs,
            fs.appendFile.name
        ).mockResolvedValue()

        _service = new Service({
            filename
        })
    })

    describe('#create - spies', () => {
        it('should call appendFile with right params', async () => {
            // AAA - arrange, act, assert

            const input = {
                username: 'user1',
                password: 'passwd123'
            }
            const expectedCreatedAt = new Date().toISOString()

            // Arrange
            jest.spyOn(
                Date.prototype,
                Date.prototype.toISOString.name
            ).mockReturnValue(expectedCreatedAt)

            //Act
            await _service.create(input)
            
            //Assert
            expect(crypto.createHash).toHaveBeenCalledWith('sha256')

            const hash = crypto.createHash('sha256')
            expect(hash.update).toHaveBeenCalledWith(input.password)
            expect(hash.digest).toHaveBeenCalledWith('hex')

            const expected = JSON.stringify({
                ...input,
                createdAt: expectedCreatedAt,
                password: MOCKED_HASH_PWD
            }).concat('\n')

            expect(fs.appendFile).toHaveBeenCalledWith(
                filename,
                expected
            )
        })
    })
})