console.log('script is running');

const socket = io();

socket.on('connect', () => {
    console.log('connected to the server');
});

socket.on('disconnect', () => {
    console.log('disconnected from server');
});