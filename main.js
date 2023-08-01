// Import the components we need from the Tableau Embedding API 
import {
    TableauViz,
    TableauAuthoringViz,
    TableauEventType,
} from 'https://10ax.online.tableau.com/javascripts/api/tableau.embedding.3.2.0.js';

// Define an object to define our dashboard list and help us track the web app's state 
// Defina um objeto para definir nossa lista de painéis e nos ajudar a rastrear o estado do aplicativo da web
let details = {
    dashboards: [
        {
            title: 'Temperatura Global',
            url: 'https://prod-useast-b.online.tableau.com/#/site/axetecnologialtda/views/TesteDashWebAPIEmbebbed/GlobalTemperatures'
        },
        {
            title: 'Clientes Superloja',
            url: 'https://prod-useast-b.online.tableau.com/#/site/axetecnologialtda/views/Superstore/Customers'
        },
        {
            title: 'Produto Superloja',
            url: 'https://prod-useast-b.online.tableau.com/#/site/axetecnologialtda/views/Superstore/Product?:iid=7'
        },
        {
            title: 'Performance Superloja',
            url: 'https://prod-useast-b.online.tableau.com/#/site/axetecnologialtda/views/Superstore/Performance?:iid=3'
        },
    ],
    currentDashboardIndex: 0,
    isAuthoringMode: true,
    divId: 'tableauViz'
}

// Function for rendering a tableau viz 
// Função para renderizar uma visualização de tableau
function renderViz() {

    // Which Tableau dashboard/viz do we display?
    // Qual painel/visualização do Tableau exibimos?
    const dashboard = details.dashboards[details.currentDashboardIndex];

    // Make sure the div container is empty
    // Verifique se o contêiner div está vazio
    let tableauContainer = document.getElementById(details.divId)
    tableauContainer.replaceChildren();

    // Render in web authoring mode or view only?
    // Renderizar no modo de criação da Web ou apenas visualizar?
    let viz;
    if (details.isAuthoringMode) {
        // Create a new tableau authoring viz object
        // Criar um novo objeto de visualização de criação de tableau
        viz = new TableauAuthoringViz();
        viz.src = dashboard.url;
        viz.hideCloseButton = true;
    } else {
        // Create a new tableau viz object
        // Criar um novo objeto tableau viz
        viz = new TableauViz();
        viz.src = dashboard.url;
        viz.toolbar = 'hidden';
    }

    // Append the viz to the div container
    // Anexar a visualização ao contêiner div
    tableauContainer.appendChild(viz);
}

// Handler for web authoring toggle
// Manipulador para alternância de criação na Web
function webAuthoringToggle(event) {

    // Toggle the isAuthoringMode boolean
    // Alternar o booleano isAuthoringMode
    details.isAuthoringMode = !details.isAuthoringMode;

    // Re-render the viz
    // Re-renderize a visualização
    renderViz();

    // Update the button's UI
    // Atualize a IU do botão
    renderButton(event.target);
}
// Function to update the display properties of the Web Authoring button
// Função para atualizar as propriedades de exibição do botão Web Authoring
function renderButton(button) {
    // Switch the class, based on toggle status
    // Alternar a classe, com base no status de alternância
    button.className = details.isAuthoringMode ? 'btn btn-primary' : 'btn btn-outline-primary';
    // Switch the button text, based on toggle status
    // Mude o texto do botão, com base no status de alternância
    button.innerText = details.isAuthoringMode ? 'Web Authoring' : 'View Only';
}

// Handler for dashboard navigation
// Manipulador para navegação no painel
function switchDashboard(event) {

    // Determine the index of the selected tab
    // Determinar o índice da guia selecionada
    const index = parseInt(event.target.attributes.getNamedItem('idx').value);

    // Change the currentDashboardIndex
    // Alterar o currentDashboardIndex
    details.currentDashboardIndex = index;

    // Re-render the viz 
    renderViz();

    // Update the active tab
    // Atualize a guia ativa
    document.querySelectorAll("#nav a").forEach((tab, tabIndex) => {
        tab.className = (tabIndex == index) ? "nav-link active" : "nav-link";
    })
}

// Function to setup the tab navigation bar
// Função para configurar a barra de navegação da aba
function init() {

    /************************/
    /* Default Viz */
    /************************/

    renderViz();

    /************************/
    /* Navigation Tabs */
    /************************/

    // Get the nav bar
    // Obtenha a barra de navegação
    let navContainer = document.getElementById('nav');

    // Loop through each dashboard
    // Percorra cada painel
    details.dashboards.forEach((dashboard, index) => {
        // Is this the active tab?
        // Esta é a guia ativa?
        const isActive = (index === details.currentDashboardIndex) ? 'active' : '';

        // Create a tab for this dashboard/viz
        // Criar uma guia para este painel/visualização
        let tab = document.createElement('template');
        tab.innerHTML = `<li class="nav-item"><a class="nav-link ${isActive}" idx="${index}" href="#">${dashboard.title}</a>`

        // Append the tab to the web page
        // Anexar a guia à página da Web
        navContainer.appendChild(tab.content.firstChild);
    })

    // Add click handlers
    // Adicionar gerenciadores de cliques
    document.querySelectorAll("#nav a").forEach(tab => {
        tab.addEventListener('click', event => {
            event.preventDefault();
            switchDashboard(event);
        })
    })

    /*************************/
    /* Web Authoring button */
    /*************************/
    // Get a reference to the web authoring toggle button
    // Obtenha uma referência para o botão de alternância de criação na Web
    let button = document.getElementById('webAuthoringToggle');

    // Add click handler
    // Adicionar gerenciador de cliques
    button.addEventListener('click', webAuthoringToggle)
    // Update the HTML to show the difference between web authoring and view-only
    // Atualize o HTML para mostrar a diferença entre criação na Web e somente visualização
    renderButton(button);
}
init();