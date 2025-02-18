import { it, expect, describe } from '@jest/globals'
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
    it.todo('should register a new user with young-adult category');
    it.todo('should register a new user with adult category');
    it.todo('should register a new user with senior category');
    it.todo('should throw an error when registering a under-age user');
})