const form = document.getElementById('teams-form');
const namesInput = document.getElementById('names');
const teamsInput = document.getElementById('teams');
const formSection = document.getElementById('form-section');
const resultsSection = document.getElementById('results-section');
const teamsContainer = document.getElementById('teams-container');

const STORAGE_KEY = 'rondos_saved_names';

// Load saved names on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSavedNames();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateTeams();
});

function generateTeams() {
    // Reset errors
    document.getElementById('names-error').textContent = '';
    document.getElementById('teams-error').textContent = '';

    // Get and validate input
    const namesText = namesInput.value.trim();
    const numTeams = parseInt(teamsInput.value);

    if (!namesText) {
        document.getElementById('names-error').textContent = 'Ingresa al menos un nombre';
        return;
    }

    const names = namesText
        .split('\n')
        .map(n => n.trim())
        .filter(n => n.length > 0);

    if (names.length < numTeams) {
        document.getElementById('names-error').textContent =
            `No hay suficientes personas (${names.length}) para ${numTeams} equipos`;
        return;
    }

    if (numTeams < 2) {
        document.getElementById('teams-error').textContent = 'Necesitas al menos 2 equipos';
        return;
    }

    // Save names to storage
    saveNames(names);

    // Shuffle names
    const shuffled = [...names].sort(() => Math.random() - 0.5);

    // Create teams
    const teams = Array.from({ length: numTeams }, () => []);
    shuffled.forEach((name, index) => {
        teams[index % numTeams].push(name);
    });

    // Display results
    displayTeams(teams);
}

function displayTeams(teams) {
    teamsContainer.innerHTML = '';

    teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';

        const title = document.createElement('h3');
        title.textContent = `Equipo ${index + 1} (${team.length} ${team.length === 1 ? 'jugador' : 'jugadores'})`;
        teamDiv.appendChild(title);

        const list = document.createElement('ul');
        team.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            list.appendChild(li);
        });
        teamDiv.appendChild(list);

        teamsContainer.appendChild(teamDiv);
    });

    formSection.style.display = 'none';
    resultsSection.classList.add('show');
}

function saveNames(names) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch (e) {
        console.error('Error saving names to localStorage:', e);
    }
}

function loadSavedNames() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const names = JSON.parse(saved);
            namesInput.value = names.join('\n');
        }
    } catch (e) {
        console.error('Error loading names from localStorage:', e);
    }
}

function clearSavedNames() {
    if (confirm('¿Estás seguro de que quieres borrar todos los nombres guardados?')) {
        try {
            localStorage.removeItem(STORAGE_KEY);
            namesInput.value = '';
            alert('Nombres borrados correctamente');
        } catch (e) {
            console.error('Error clearing names from localStorage:', e);
        }
    }
}

// Make function globally available for onclick attribute
window.clearSavedNames = clearSavedNames;