const CLIENT_ID = 'a5d39b1dca37459bb0dd76c93143717d';
const CLIENT_SECRET = '221af3f0b4bc452da668b3ad47babf92';

// Autenticação API
async function authenticate() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Pesquisar músicas
async function search() {
  const token = await authenticate();
  const searchInput = document.getElementById('searchInput').value;
  const searchType = document.getElementById('searchType').value;
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=${searchType}`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });

  const data = await response.json();
  displayResults(data[`${searchType}s`].items);
}

// Exibir os resultados
function displayResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    const sortOrder = document.getElementById('sortOrder').value;

    // Função de comparação para ordenação
    const compareFunction = (a, b) => {
        if (sortOrder === 'alpha') {
            // Ordena alfabeticamente
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        } else if (sortOrder === 'default') {
          //Ordena por popularidade
        }
    };

    // Ordenar
    items.sort(compareFunction);

    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.setAttribute('data-index', index);

        if (item.type === 'track') {
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong> by ${item.artists.map(artist => artist.name).join(', ')}</p>
                <p>Album: <strong>${item.album.name}</strong></p>
                <img src="${item.album.images[0].url}" alt="Album Cover" style="width: 200px; height: 200px;">
            `;
        } else if (item.type === 'album') {
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong> by ${item.artists.map(artist => artist.name).join(', ')}</p>
                <img src="${item.images[0].url}" alt="Album Cover" style="width: 200px; height: 200px;">
            `;
        } else if (item.type === 'artist') {
            itemElement.innerHTML = `
                <p><strong>${item.name}</strong></p>
                <img src="${item.images[0].url}" alt="Artist Image" style="width: 200px; height: 200px;">
            `;
        }

        itemElement.innerHTML += '<hr>';
        resultsContainer.appendChild(itemElement);
    });
}

  