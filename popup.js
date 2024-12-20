function displaySavedPages() {
  chrome.storage.local.get({ savedPages: [] }, (data) => {
      const linksList = document.getElementById('links');
      linksList.innerHTML = ''; // Effacer la liste actuelle

      data.savedPages.forEach((page, index) => {
          const listItem = document.createElement('li');
          listItem.className = 'link-item';

          // Conteneur principal pour le lien et les boutons
          const linkContainer = document.createElement('div');
          linkContainer.className = 'link-container';

          // Ajouter le titre comme lien cliquable
          const link = document.createElement('a');
          link.href = page.url;
          link.textContent = page.title;
          link.target = '_blank';
          link.className = 'link-title';

          // Conteneur des boutons
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'button-container';

          // Bouton pour modifier le titre
          const editButton = document.createElement('button');
          editButton.textContent = '✏️';
          editButton.className = 'edit-button';
          editButton.addEventListener('click', () => {
              editTitle(index, page.title);
          });

          // Bouton pour copier le lien
          const copyButton = document.createElement('button');
          copyButton.textContent = '📋';
          copyButton.className = 'copy-button';
          copyButton.addEventListener('click', () => {
              copyToClipboard(`${page.title} | ${page.url}`);
          });

          // Bouton pour supprimer le lien
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '🗑️';
          deleteButton.className = 'delete-button';
          deleteButton.addEventListener('click', () => {
              deletePage(index);
          });

          // Ajout des éléments au conteneur
          buttonContainer.appendChild(editButton);
          buttonContainer.appendChild(copyButton);
          buttonContainer.appendChild(deleteButton);
          linkContainer.appendChild(link);
          linkContainer.appendChild(buttonContainer);
          listItem.appendChild(linkContainer);
          linksList.appendChild(listItem);
      });
  });
}

// Fonction pour copier dans le presse-papier
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
  }).catch((err) => {
      alert('Échec de la copie : ' + err);
  });
}
  
  
  // Fonction pour modifier le titre
  function editTitle(index, oldTitle) {
    const newTitle = prompt('Modifier le titre de la page :', oldTitle);
    if (newTitle && newTitle.trim() !== '') {
      chrome.storage.local.get({ savedPages: [] }, (data) => {
        const savedPages = data.savedPages;
        savedPages[index].title = newTitle; // Mettre à jour le titre
        chrome.storage.local.set({ savedPages }, () => {
          displaySavedPages(); // Rafraîchir la liste
        });
      });
    }
  }
  
  // Fonction pour sauvegarder la page actuelle
  document.getElementById('save-page').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        const page = { title: currentTab.title, url: currentTab.url, timestamp: new Date().toISOString() };
  
        chrome.storage.local.get({ savedPages: [] }, (data) => {
          const savedPages = data.savedPages;
          savedPages.push(page);
          chrome.storage.local.set({ savedPages }, () => {
            displaySavedPages();
          });
        });
      }
    });
  });
  
  
  // Fonction pour supprimer une page
  function deletePage(index) {
    chrome.storage.local.get({ savedPages: [] }, (data) => {
      const savedPages = data.savedPages;
      savedPages.splice(index, 1); // Supprimer l'élément à l'index donné
      chrome.storage.local.set({ savedPages }, () => {
        displaySavedPages(); // Rafraîchir la liste
      });
    });
  }
  

// Fonction pour supprimer toutes les pages
function deleteAllPages() {
    chrome.storage.local.set({ savedPages: [] }, () => {
      displaySavedPages(); // Rafraîchir la liste après suppression
    });
  }
  
  // Ajouter un gestionnaire d'événements pour le bouton "delete-all-page"
  document.getElementById('delete-all-page').addEventListener('click', deleteAllPages);
  

  // Afficher les pages enregistrées au chargement
  document.addEventListener('DOMContentLoaded', displaySavedPages);
  
