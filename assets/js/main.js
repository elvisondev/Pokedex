
const listaPokemons = document.getElementById('listaPokemons')
const botaoCarregarMais = document.getElementById('botaoCarregarMais')

const totalPokemons = 151
const quantidadePorPagina = 10
let inicio = 0

function criarCardPokemon(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <div class="pokemon-header">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            </div>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((tipo) => `
                        <li class="type ${tipo}">${tipo}</li>
                    `).join('')}
                </ol>

                <img
                    src="${pokemon.photo}"
                    alt="Imagem do Pokémon ${pokemon.name}"
                    loading="lazy"
                >
            </div>

            <!-- * Atributos principais do Pokémon -->
            <div class="pokemon-stats">
                <div class="stat">
                    <span>HP</span>
                    <strong>${pokemon.hp}</strong>
                </div>

                <div class="stat">
                    <span>Ataque</span>
                    <strong>${pokemon.attack}</strong>
                </div>

                <div class="stat">
                    <span>Defesa</span>
                    <strong>${pokemon.defense}</strong>
                </div>

                <div class="stat">
                    <span>Velocidade</span>
                    <strong>${pokemon.speed}</strong>
                </div>
            </div>

            <div class="pokemon-physical">
                <span>Altura: ${pokemon.height.toLocaleString('pt-BR')} m</span>
                <span>Peso: ${pokemon.weight.toLocaleString('pt-BR')} kg</span>
            </div>
        </li>
    `
}

function carregarPokemons(inicioAtual, quantidade) {
    botaoCarregarMais.disabled = true

    return pokeApi.listarPokemons(inicioAtual, quantidade)
        .then((pokemons) => {
            const novosCards = pokemons.map(criarCardPokemon).join('')

            listaPokemons.insertAdjacentHTML('beforeend', novosCards)

            inicio = inicioAtual + pokemons.length

            if (inicio >= totalPokemons || pokemons.length === 0) {
                botaoCarregarMais.remove()
            }
        })
        .catch((erro) => {
            // ! Se a API falhar, mantenho a página atual para tentar novamente.
            console.error('Erro ao carregar os Pokémon:', erro)
            alert('Não foi possível carregar os Pokémon. Tente novamente.')
        })
        .finally(() => {
            botaoCarregarMais.disabled = false
        })
}

carregarPokemons(inicio, quantidadePorPagina)

botaoCarregarMais.addEventListener('click', () => {
    const quantidadeRestante = totalPokemons - inicio
    const quantidade = Math.min(quantidadePorPagina, quantidadeRestante)

    if (quantidade > 0) {
        carregarPokemons(inicio, quantidade)
    }
})
