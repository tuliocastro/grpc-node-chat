let grpc = require("grpc");
var protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = "protos/chat.proto";

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var proto = grpc.loadPackageDefinition(packageDefinition);

let observers = [];

function join(call, callback){

    observers.push(call);

    notifyObservers({user: "Server", text: "new user joined ..."});

}

function send(call, callback){

    notifyObservers(call.request);
}

function notifyObservers(message){
        
    observers.forEach(observer => {
        observer.write(message);
    })

}

function main(){

    server.addService(proto.example.Chat.service, {join: join, send: send});

    server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

    server.start();

    console.log("Server started");

}

main();