import { it, describe, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service.js'
import fs from 'node:fs/promises'
import fsSync from "node:fs"

describe('Service Test Suite', () => {
    let _service
    const filename = 'testFile.ndjson'
    beforeEach(() => {
        _service = new Service({
            filename
        })
        jest.resetAllMocks()
    })

    describe('#read', () => {
        it('should return an empty array if file does not exist', async () => {
            jest.spyOn(
                fsSync,
                fsSync.existsSync.name
            ).mockReturnValue(false)

            const result = await _service.read()

            expect(result).toEqual([])
        })

        it('should return an empty array if the file is empty', async () => {
            jest.spyOn(
                fs,
                fs.readFile.name
            ).mockResolvedValue('')

            const result = await _service.read()
            expect(result).toEqual([])
        })

        it('should return users without password if file contains users', async () => {
            const dbData = [
                {
                    username: 'user1',
                    password: 'passwd1',
                    createdAt: new Date().toISOString()
                },
                {
                    username: 'user2',
                    password: 'passwd2',
                    createdAt: new Date().toISOString()
                }
            ]

            const fileContents = dbData
                .map(item => JSON.stringify(item).concat('\n')).join('')

            jest.spyOn(
                fsSync,
                'existsSync'
            ).mockReturnValue(true)
            
            jest.spyOn(
                fs,
                'readFile'
            ).mockResolvedValue(fileContents)

            const result = await _service.read()

            const expected = dbData.map(({ password, ...rest }) => ({ ...rest }))

            expect(result).toEqual(expected)
        })
    })
})