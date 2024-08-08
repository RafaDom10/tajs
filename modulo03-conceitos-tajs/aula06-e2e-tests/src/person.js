class Person {

    static validate(person) {
        if(!person.name) throw new Error('Name is required')
        if(!person.cpf) throw new Error('CPF is required')
    }

    static format(person) {
        const [name, ...lastName] = person.name.split(' ')
        return {
            name,
            lastName: lastName.join(' '),
            cpf: person.cpf.replace(/\D/g, '')
        }
    }

    static save(person) {
        if(![ 'name', 'lastName', 'cpf' ].every(prop => person[prop])) {
            throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`)
        }

        return true
    }

    static process(person) {
        this.validate(person)
        const personFormatted = this.format(person)
        this.save(personFormatted)
        return 'ok'
    }

}

Person.process({ name: 'Rafael Domingues', cpf: '407.547.458-56' })

export default Person