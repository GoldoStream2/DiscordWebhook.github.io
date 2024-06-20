document.getElementById('addEmbedBtn').addEventListener('click', addEmbed);

document.getElementById('webhookForm').addEventListener('submit', function (e) {
    e.preventDefault();
    sendWebhook();
});

function addEmbed() {
    const embedsContainer = document.getElementById('embedsContainer');
    const embedDiv = document.createElement('div');
    embedDiv.className = 'embed';

    embedDiv.innerHTML = `
        <label>Titre:</label>
        <input type="text" class="embedTitle">
        <label>Description:</label>
        <textarea class="embedDescription"></textarea>
        <label>Couleur:</label>
        <input type="text" class="embedColor" value="5814783">
        <label>Auteur:</label>
        <input type="text" class="embedAuthor">
        <label>Footer:</label>
        <input type="text" class="embedFooter">
        <label>Timestamp:</label>
        <input type="datetime-local" class="embedTimestamp">
        <div class="fieldsContainer">
            <h3>Fields</h3>
            <button type="button" class="addFieldBtn">Ajouter un Field</button>
        </div>
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
    const username = document.getElementById('username').value;
    const content = document.getElementById('content').value;
    const threadName = document.getElementById('threadName').value;

    const embeds = Array.from(document.querySelectorAll('.embed')).map(embedDiv => {
        const title = embedDiv.querySelector('.embedTitle').value;
        const description = embedDiv.querySelector('.embedDescription').value;
        const color = embedDiv.querySelector('.embedColor').value;
        const author = embedDiv.querySelector('.embedAuthor').value;
        const footer = embedDiv.querySelector('.embedFooter').value;
        const timestamp = embedDiv.querySelector('.embedTimestamp').value;

        const fields = Array.from(embedDiv.querySelectorAll('.field')).map(fieldDiv => {
            return {
                name: fieldDiv.querySelector('.fieldName').value,
                value: fieldDiv.querySelector('.fieldValue').value
            };
        });

        const embed = {};
        if (title) embed.title = title;
        if (description) embed.description = description;
        if (color) embed.color = parseInt(color);
        if (author) embed.author = { name: author };
        if (footer) embed.footer = { text: footer };
        if (timestamp) embed.timestamp = new Date(timestamp).toISOString();
        if (fields.length) embed.fields = fields;

        return embed;
    });

    const payload = {};
    if (username) payload.username = username;
    if (content) payload.content = content;
    if (embeds.length) payload.embeds = embeds;
    if (threadName) payload.thread_name = threadName;

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
            alert('Erreur lors de l\'envoi du webhook.');
        }
    }).catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi du webhook.');
    });
}
