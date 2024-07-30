import Service from "./service.js";

const data = {
    username: `rafaeldom-${Date.now()}`,
    password: 'senha12345'
}

const service = new Service({
    filename: 'users.ndjson'
})

await service.create( data )

const users = await service.read()
console.log("🚀 ~ users:", users)