console.log('script is running');

const socket = io();

socket.on('connect', () => {
    console.log('connected to the server');
});

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a')
    let li = $("<li></li>");
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    $("#messages").append(li);
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
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
    let li = $("<li></li>");
    let a = $('<a target="_blank">My current location</a>');
    let formattedTime = moment(message.createdAt).format('h:mm a')

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    $("#messages").append(li);    
    
});
