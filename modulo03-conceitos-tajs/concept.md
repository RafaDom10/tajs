mocks - (mocking/simular) Ao invés de esperar o resultado real, é fixado o resultado que esperamos dos serviços e validamos como o código se comporta, técnica utilizada para isolar uma função que está sendo testada, substituindo qualquer interação interna por versões simuladas (mocks).

stubs - uma especificação dos mocks, são utilizados para simular cenários de conexões externas, ex.: simular o estado de uma API externa.

spies - usados para inspecionar quantas vezes uma função foi chamada, assim como conferir se os parâmetros estão corretos na chamada.