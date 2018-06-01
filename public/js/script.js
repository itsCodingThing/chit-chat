console.log('script is running');

const socket = io();

function scrollToBottom() { 
    let messages = $("#messages");
    let newMessage = messages.children('li:last-child');

    // heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
    
}

socket.on('connect', () => {
    let param = $.deparam(window.location.search);
    socket.emit('join', param, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

socket.on('updateUserList', (users) => {
    console.log('users list', users);
    let ol = $("<ol></ol>");

    users.forEach((user) => {
        ol.append($('<li></li>').text(user));
    });

    $("#users").html(ol);
});

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a')
    let template = $("#message-template").html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $("#messages").append(html);
    scrollToBottom();
});

$("#message-form").on("submit", (e) => {
    e.preventDefault();
    let messageTextBox = $("[name=message]"); 
    console.log("submited");
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, () => {
        messageTextBox.val("");
    });
});

let locationButton = $("#send-location");
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported");
    };
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            logitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Sending location');   
        alert("Unable to fetch position");
    });
});

socket.on('generateLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a')
    let template = $("#location-message-template").html();
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $("#messages").append(html);
    scrollToBottom();    
});
