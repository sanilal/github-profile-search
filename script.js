const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')
// function getUser(username) {
//     axios(APIURL + username)
//         .then(res => console.log(res.data))
//         .catch(err => console.log(err))
// }

async function getUser(username) {
    try {
        const { data  } = await axios(APIURL + username)
        createUsercard(data)
        getRepos(username) 
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No profile with this user name')
        }
    }
} 

async function getRepos(username) {
    try {
        const { data  } = await axios(APIURL + username + '/repos?sort=created')
        addReposTocard(data)

    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('Problem Fetching Repos')
        }
    }
}

function createUsercard(user) {
    const cardHTML = `
    <div class="card">
    <div>
        <img src="${user.avatar_url}" alt="${user.name}">
    </div>
    <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>
        <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos">
            
        </div>
    </div>
    
</div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `

    main.innerHTML = cardHTML
}

function addReposTocard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.textContent = repo.name

            reposEl.appendChild(repoEl)
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})