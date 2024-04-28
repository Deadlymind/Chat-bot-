document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#submitBtn').addEventListener('click', () => chat_ajax());
});

function myFunction() {
    document.getElementById("userText").disabled = true;
    document.querySelector('#userText').setAttribute('placeholder', 'Please wait, your result will come soon...');
}

function enableUserText() {
    // Enable the input field
    document.getElementById("userText").disabled = false;
    document.querySelector('#userText').setAttribute('placeholder', 'Ask your question');
}

function chat_ajax() {
    const md = new markdownit({ html: true });
    let text = document.querySelector('#userText').value;
    let html = md.renderInline(text);
    let chatCard = document.querySelector('#scroll');
    
    // Append user's message to chat card
    chatCard.innerHTML += `
        <div class="d-flex flex-row justify-content-end mb-3">
            <div>
                <div style="background-color: #1b1b1b8e; font-size: smaller; border-radius: 20px 0px 20px 20px;" class="small p-2 me-2 mb-1 text-white ms-auto">${text}</div>
            </div>
            <img class="rounded-circle mb-1" src="https://espere.in/static/images/profile.webp" alt="avatar 1" style="width: 40px; height: 100%;">
        </div>
    `;
    chatCard.scrollTop = chatCard.scrollHeight;

    document.querySelector('#userText').value = null;

    var loading = document.querySelector('#loading');
    myFunction();
    loading.innerHTML = `
        <div class="loader">
        </div>
    `;
    chatCard.scrollTop = chatCard.scrollHeight;

    // Use $.post instead of $.ajax for a simpler POST request
    $.post('/ask_question/', { 'text': text, csrfmiddlewaretoken: '{{ csrf_token }}' }, function(res) {
        var response = md.render(res.data.text);
        var chatCard = document.getElementById('scroll');
        var typingSpeed = 15;

        var responseDataDiv = document.createElement('div');
        responseDataDiv.id = 'response_data';
        responseDataDiv.classList.add('d-flex', 'flex-row', 'justify-content-start', 'mb-3');
        chatCard.appendChild(responseDataDiv);

        var avatarImg = document.createElement('img');
        avatarImg.src = "https://espere.in/static/images/newlogo.png";
        avatarImg.alt = "avatar 1";
        avatarImg.style.width = '40px';
        avatarImg.style.height = '100%';
        responseDataDiv.appendChild(avatarImg);

        var chatAreaDiv = document.createElement('div');
        chatAreaDiv.id = 'chatArea';
        chatAreaDiv.classList.add('small', 'p-2', 'ms-2', 'mb-1', 'me-auto', 'text-dark');
        chatAreaDiv.style.backgroundColor = '#ffffffb8';
        chatAreaDiv.style.fontSize = 'smaller';
        chatAreaDiv.style.borderRadius = '0px 20px 20px 20px';
        chatAreaDiv.innerHTML = response;
        responseDataDiv.appendChild(chatAreaDiv);

        loading.innerHTML = '';
        chatCard.scrollTop = chatCard.scrollHeight;
        enableUserText();
    })
    .fail(function() {
        console.log("There was an error!");
    });
}

