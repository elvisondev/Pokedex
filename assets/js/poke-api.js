
const pokeApi = {}

function converterDetalhesPokemon(detalhes) {
    const pokemon = new Pokemon()

    pokemon.number = detalhes.id
    pokemon.name = detalhes.name
    pokemon.types = detalhes.types.map((item) => item.type.name)
    pokemon.type = pokemon.types[0]

    pokemon.photo = detalhes.sprites.other.dream_world.front_default
        || detalhes.sprites.front_default

    // * O find procura cada atributo pelo nome retornado pela API.
    pokemon.hp = detalhes.stats.find((item) => item.stat.name === 'hp')?.base_stat ?? 0
    pokemon.attack = detalhes.stats.find((item) => item.stat.name === 'attack')?.base_stat ?? 0
    pokemon.defense = detalhes.stats.find((item) => item.stat.name === 'defense')?.base_stat ?? 0
    pokemon.specialAttack = detalhes.stats.find((item) => item.stat.name === 'special-attack')?.base_stat ?? 0
    pokemon.specialDefense = detalhes.stats.find((item) => item.stat.name === 'special-defense')?.base_stat ?? 0
    pokemon.speed = detalhes.stats.find((item) => item.stat.name === 'speed')?.base_stat ?? 0

    // ! A API retorna altura em decímetros e peso em hectogramas.
    pokemon.height = detalhes.height / 10
    pokemon.weight = detalhes.weight / 10

    return pokemon
}

pokeApi.buscarDetalhes = (pokemon) => {
    return fetch(pokemon.url)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro ao buscar detalhes: ${resposta.status}`)
            }

            return resposta.json()
        })
        .then(converterDetalhesPokemon)
}

pokeApi.listarPokemons = (inicio = 0, quantidade = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${inicio}&limit=${quantidade}`

    return fetch(url)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro ao listar Pokémon: ${resposta.status}`)
            }

            return resposta.json()
        })
        .then((dados) => dados.results)

        // * Promise.all espera os detalhes de todos os Pokémon antes de montar os cards.
        .then((lista) => Promise.all(lista.map(pokeApi.buscarDetalhes)))
}
