document.getElementById('addEmbedBtn').addEventListener('click', addEmbed);

document.getElementById('webhookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    sendWebhook();
});

document.getElementById('profileToggle').addEventListener('click', function () {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu.style.display === 'none' || profileMenu.style.display === '') {
        profileMenu.style.display = 'block';
        this.textContent = 'v Profil'; // Change to down arrow
    } else {
        profileMenu.style.display = 'none';
        this.textContent = '> Profil'; // Change to right arrow
    }
});

function addEmbed() {
    const embedsContainer = document.getElementById('embedsContainer');
    const embedDiv = document.createElement('div');
    embedDiv.className = 'embed';

    embedDiv.innerHTML = `
        <label>Auteur:</label>
        <input type="text" class="embedAuthor">
        <label>URL de l'auteur:</label>
        <input type="url" class="embedAuthorUrl">
        <label>Icon URL de l'auteur:</label>
        <input type="url" class="embedAuthorIconUrl">
        
        <label>Titre:</label>
        <input type="text" class="embedTitle">
        <label>Description:</label>
        <textarea class="embedDescription"></textarea>
        <label>URL:</label>
        <input type="url" class="embedUrl">
        <label>Couleur:</label>
        <input type="color" class="embedColor" value="#58b9ff">
        
        <div class="fieldsContainer">
            <h3>Fields</h3>
            <button type="button" class="addFieldBtn">Ajouter un Field</button>
        </div>
        
        <label>Image URL:</label>
        <input type="url" class="embedImageUrl">
        <label>Thumbnail URL:</label>
        <input type="url" class="embedThumbnailUrl">
        
        <label>Footer:</label>
        <input type="text" class="embedFooter">
        <label>Timestamp:</label>
        <input type="datetime-local" class="embedTimestamp">
    `;

    embedsContainer.appendChild(embedDiv);

    embedDiv.querySelector('.addFieldBtn').addEventListener('click', addField);
}

function addField(e) {
    const fieldsContainer = e.target.closest('.fieldsContainer');
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field';

    fieldDiv.innerHTML = `
        <label>Nom:</label>
        <input type="text" class="fieldName">
        <label>Valeur:</label>
        <input type="text" class="fieldValue">
    `;

    fieldsContainer.appendChild(fieldDiv);
}

function sendWebhook() {
    const url = document.getElementById('webhookUrl').value;
    if (!isValidUrl(url)) {
        alert('L\'URL du webhook est invalide.');
        return;
    }

    const username = document.getElementById('username').value;
    const avatarUrl = document.getElementById('avatarUrl').value;
    const content = document.getElementById('content').value;
    const threadName = document.getElementById('threadName').value;

    const embeds = Array.from(document.querySelectorAll('.embed')).map(embedDiv => {
        const author = embedDiv.querySelector('.embedAuthor').value;
        const authorUrl = embedDiv.querySelector('.embedAuthorUrl').value;
        const authorIconUrl = embedDiv.querySelector('.embedAuthorIconUrl').value;
        const title = embedDiv.querySelector('.embedTitle').value;
        const description = embedDiv.querySelector('.embedDescription').value;
        const embedUrl = embedDiv.querySelector('.embedUrl').value;
        const color = embedDiv.querySelector('.embedColor').value;
        const imageUrl = embedDiv.querySelector('.embedImageUrl').value;
        const thumbnailUrl = embedDiv.querySelector('.embedThumbnailUrl').value;
        const footer = embedDiv.querySelector('.embedFooter').value;
        const timestamp = embedDiv.querySelector('.embedTimestamp').value;

        const fields = Array.from(embedDiv.querySelectorAll('.field')).map(fieldDiv => {
            return {
                name: fieldDiv.querySelector('.fieldName').value,
                value: fieldDiv.querySelector('.fieldValue').value
            };
        });

        const embed = {};
        if (author) embed.author = { name: author, url: authorUrl, icon_url: authorIconUrl };
        if (title) embed.title = title;
        if (description) embed.description = description;
        if (embedUrl) embed.url = embedUrl;
        if (color) embed.color = parseInt(color.replace('#', ''), 16);
        if (imageUrl) embed.image = { url: imageUrl };
        if (thumbnailUrl) embed.thumbnail = { url: thumbnailUrl };
        if (footer) embed.footer = { text: footer };
        if (timestamp) embed.timestamp = new Date(timestamp).toISOString();
        if (fields.length > 0) embed.fields = fields;

        return embed;
    });

    const payload = {};
    if (username) payload.username = username;
    if (avatarUrl) payload.avatar_url = avatarUrl;
    if (content) payload.content = content;
    if (embeds.length > 0) payload.embeds = embeds;
    if (threadName) payload.thread_name = threadName;

    console.log('Payload:', JSON.stringify(payload, null, 2));

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            alert('Webhook envoyé avec succès !');
        } else {
            response.text().then(text => {
                console.error('Erreur:', text);
                alert('Erreur lors de l\'envoi du webhook : ' + text);
            });
        }
    }).catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du webhook : ' + error.message);
    });
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (e) {
        return false;
    }
}
