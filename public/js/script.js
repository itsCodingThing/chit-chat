console.log('script is running');

const socket = io();

socket.on('connect', () => {
    console.log('connected to the server');
});

socket.on('newMessage', (message) => {
    console.log(`newMessage: ${message.from}, ${message.text}`);
    let li = $("<li></li>");
    li.text(`${message.from}: ${message.text}`);
    $("#messages").append(li);
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});

$("#message-form").on("submit", (e) => {
    e.preventDefault();
    console.log("submited");
    socket.emit('createMessage', {
        from: 'User',
        text: $("[name=message]").val()
    }, () => {});
});

let locationButton = $("#send-location");
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported");
    };

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            logitude: position.coords.longitude
        });
    }, () => {
        return alert("Unable to fetch position");
    });
});