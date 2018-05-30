console.log('script is running');

const socket = io();

socket.on('connect', () => {
    console.log('connected to the server');
});

socket.on('newMessage', (message) => {
    console.log(`newMessage: ${message.from}, ${message.text}`);
    
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});