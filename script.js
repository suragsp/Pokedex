document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    const caughtPokemon = JSON.parse(localStorage.getItem('caughtPokemon')) || [];

    // Function to parse Pokémon ID from URL
    function parseUrl(url) {
        return url.split('/').filter(Boolean).pop();
    }

    // Function to load Pokémon data
    async function loadPokemon(url) {
        const response = await fetch(url);
        const data = await response.json();
        nextUrl = data.next;
        data.results.forEach(pokemon => addPokemonToGallery(pokemon));
    }

    // Function to add Pokémon to gallery
    async function addPokemonToGallery(pokemon) {
        const response = await fetch(pokemon.url);
        const details = await response.json();
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'col-md-3 pokemon-card';
        pokemonCard.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png" alt="${pokemon.name}">
            <h5>${pokemon.name}</h5>
            <button class="btn btn-secondary btn-sm catch-release">${caughtPokemon.includes(details.id) ? 'Release' : 'Catch'}</button>
        `;

        pokemonCard.querySelector('img').addEventListener('click', () => showPokemonDetails(details));
        pokemonCard.querySelector('.catch-release').addEventListener('click', () => toggleCatchRelease(details.id, pokemonCard));

        if (caughtPokemon.includes(details.id)) {
            pokemonCard.classList.add('caught');
        }

        gallery.appendChild(pokemonCard);
    }

    // Function to show Pokémon details
    function showPokemonDetails(details) {
        alert(`Name: ${details.name}\nAbilities: ${details.abilities.map(a => a.ability.name).join(', ')}\nTypes: ${details.types.map(t => t.type.name).join(', ')}`);
    }

    // Function to toggle catch/release Pokémon
    function toggleCatchRelease(id, card) {
        const index = caughtPokemon.indexOf(id);
        if (index > -1) {
            caughtPokemon.splice(index, 1);
            card.classList.remove('caught');
            card.querySelector('.catch-release').textContent = 'Catch';
        } else {
            caughtPokemon.push(id);
            card.classList.add('caught');
            card.querySelector('.catch-release').textContent = 'Release';
        }
        localStorage.setItem('caughtPokemon', JSON.stringify(caughtPokemon));
    }

    // Load initial Pokémon data
    loadPokemon(nextUrl);

    // Load more Pokémon on button click
    loadMoreButton.addEventListener('click', () => loadPokemon(nextUrl));
});
