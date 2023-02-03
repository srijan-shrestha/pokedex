function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

let pokemonList = [];
let pokemonDetailList = [];
let selectedPokemon = null;

docReady(function () {
  fetchPokemonList();
});

// Function to fetch Pockemon List
function fetchPokemonList() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=6&offset=0")
    .then((response) => response.json())
    .then((data) => {
      pokemonList = data.results;
      fetchPokemonDetailList();
    });
}

// Function to fetch pokemon detail list
function fetchPokemonDetailList() {
  if (pokemonList.length) {
    for (let index = 0; index < pokemonList.length; index++) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonList[index].name}`)
        .then((response) => response.json())
        .then((data) => {
          pokemonDetailList.push(data);
          if (pokemonList.length === pokemonDetailList.length) {
            renderPokemons();
          }
        });
    }
  }
}


function onPokemonSelect(pokemon) {
  selectedPokemon = pokemonDetailList[pokemon];
  $("#specs_name").text(selectedPokemon.name);
  $("#specs_height").text(selectedPokemon.height);
  $("#specs_BE").text(selectedPokemon.base_experience);
  renderAbilities(selectedPokemon.abilities);
}

function renderPokemons() {
  if (pokemonDetailList.length) {
    let str = "";
    for (let index = 0; index < pokemonDetailList.length; index++) {
      const element = pokemonDetailList[index];
      str =
        str +
        `<div class="pokemon-item">
            <figure class="img-container" onclick="onPokemonSelect(${index})">
                <img src=${element.sprites.front_default} alt=${element.name}>
            </figure>
            <div class="pokemon-name" onclick="onPokemonSelect(${index})">
                ${element.name}
            </div>
        </div>`;
    }
    $("#pokemonList").html(str);
  }
}

function renderAbilities(abilities) {
  if (abilities.length) {
    let str = "";
    abilities.forEach((e) => {
    const id = e.ability.url.slice(-3);
      str =
        str +
        `<span id="${e.ability.url}" class="ability" onclick="onAbilitySelect(${id.replace("/", "")})">${e.ability.name}</span>`;
      const l = $(`#${e.ability.url}`);
      $(`#${e.ability.url}`).click(function () {
        onAbilitySelect(l.selector.substring(1));
      });
    });
    $("#specs_abilities").html(str);
  }
}

function onAbilitySelect(event) {
  const url = 'https://pokeapi.co/api/v2/ability/';
  if (event) {
    fetch(url+event)
      .then((response) => response.json())
      .then((data) => {
        renderAbilityDescription(data);
      });
  }
}

function renderAbilityDescription(data) {
  const name = data.name;
  const abilityEffect = getEffect(data.effect_entries);
  const shortEffect = getEffect(data.effect_entries);
  const flavourText = data.flavor_text_entries[0].flavor_text;

  $('#ability_name').text(name);
  $('#ability_effect').text(abilityEffect.effect);
  $('#short_effect').text(shortEffect.short_effect);
  $('#flavour_text').text(flavourText);

}

function getEffect(data) {
    const t =  data.find(e => e.language.name === 'en');
    const obj = {
        effect: t.effect,
        short_effect: t.short_effect
    }
    return obj;
}





