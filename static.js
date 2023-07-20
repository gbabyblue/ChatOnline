

var socket = io.connect()

    const messageDiv = document.getElementById('messages')
    const settings = {
        url: 'https://chatv2.azurewebsites.net/messages',
        headers: {"Access-Control-Allow-Origin": "*"}
    }

        var protocol = window.location.protocol // === 'http:' ? 'ws://' : 'wss://';
        var address = protocol + window.location.host + window.location.pathname + ':' + window.location.port + '/messages';
        console.log(address)

    async function clearMessages(func) {
        while (messageDiv.firstChild) {
            messageDiv.firstChild.remove()
        }
        await func
    }


    $(() => {
        $('#send').click(() => {
            sendMessage({
                name: $('#name').val(),
                message:$('#message').val()
            })
        })
        getMessages()
    })

    $(() => {
        $('#send2').click(() => {
        clearMessages(getMessageOfUser())
        })
    })

    $(() => {
        $('#send3').click(() => {
        clearMessages(getAllMessages())
        })
    })
    console.log(messageDiv.firstChild)

    function addMessages(message){
        $('#messages').prepend(
            `<h4> ${message.name} </h4>
            <p> ${message.message} </p>`
        )
        console.log('hello')
    }

    function getMessages(){
        $.get(settings, (data) => {
        data.forEach(addMessages);
        })
    }

    function getMessageOfUser(){
        $.get('https://chatv2.azurewebsites.net/messages/' + $('#name').val(), (data) => {
        data.forEach(addMessages);
        })
    }

    function getAllMessages(){
        $.get(settings, (data) => {
        data.forEach(addMessages);
        })
    }

    function sendMessage(message) { 
        $.post(settings, message)
        console.log('cool')
    }

    socket.on('message', addMessages) 
