
const ranges = {
    "1-5": [1, 2, 3, 4, 5],
    "6-11": [6, 7, 8, 9, 10, 11],
    "12-17": [12, 13, 14, 15, 16, 18]
};


const characterImages = {
    "1": "https://starwars-visualguide.com/assets/img/characters/1.jpg",  
    "2": "https://starwars-visualguide.com/assets/img/characters/2.jpg",  
    "3": "https://starwars-visualguide.com/assets/img/characters/3.jpg",  
    "4": "https://starwars-visualguide.com/assets/img/characters/4.jpg",  
    "5": "https://starwars-visualguide.com/assets/img/characters/5.jpg",  
    "6": "https://starwars-visualguide.com/assets/img/characters/6.jpg",  
    "7": "https://starwars-visualguide.com/assets/img/characters/7.jpg",  
    "8": "https://starwars-visualguide.com/assets/img/characters/8.jpg",  
    "9": "https://starwars-visualguide.com/assets/img/characters/9.jpg",  
    "10": "https://starwars-visualguide.com/assets/img/characters/10.jpg", 
    "11": "https://starwars-visualguide.com/assets/img/characters/11.jpg", 
    "12": "https://starwars-visualguide.com/assets/img/characters/12.jpg", 
    "13": "https://starwars-visualguide.com/assets/img/characters/13.jpg", 
    "14": "https://starwars-visualguide.com/assets/img/characters/14.jpg", 
    "15": "https://starwars-visualguide.com/assets/img/characters/15.jpg", 
    "16": "https://starwars-visualguide.com/assets/img/characters/16.jpg", 
    "18": "https://starwars-visualguide.com/assets/img/characters/18.jpg",  
};


let abortController = new AbortController();
let currentRange = null; 



function createCharacterCard(id, name, height, mass) {
    const card = document.createElement('div');
    card.classList.add('character-card');


    const imageUrl = characterImages[id] || 'default-image.jpg'; 


    const characterName = name || 'Nombre desconocido';
    const characterHeight = height !== 'unknown' && height ? `${height} cm` : 'Estatura desconocida';
    const characterMass = mass !== 'unknown' && mass ? `${mass} kg` : 'Peso desconocido';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${characterName}" class="character-image">
        <h3>${characterName}</h3>
        <p>Estatura: ${characterHeight}</p>
        <p>Peso: ${characterMass}</p>
    `;
    return card;
}

// Función para obtener personajes desde la API
async function getCharacters(range) {
    const container = document.getElementById('characters-container');
    

    if (currentRange === range) return;

    currentRange = range; 


    abortController.abort();
    abortController = new AbortController(); 

    container.innerHTML = '<p>Cargando personajes...</p>'; 

    try {
        const promises = ranges[range].map(id => 
            fetch(`https://swapi.dev/api/people/${id}/`, { signal: abortController.signal })
            .then(res => res.json().then(character => ({ ...character, id })))
        );
        const characters = await Promise.all(promises);

        container.innerHTML = ''; 


        characters.forEach(character => {
            if (character.name) {
                const card = createCharacterCard(character.id, character.name, character.height, character.mass);
                container.appendChild(card);
            }
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Solicitud cancelada');
        } else {
            console.error('Error al obtener personajes:', error);
            container.innerHTML = '<p>Error al cargar personajes.</p>';
        }
    }
}



document.querySelectorAll('.range').forEach(rangeElement => {
    rangeElement.addEventListener('mouseenter', () => {
        const range = rangeElement.getAttribute('data-range');
        getCharacters(range);
    });
});
