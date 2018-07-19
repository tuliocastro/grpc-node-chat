let grpc = require("grpc");
var protoLoader = require('@grpc/proto-loader');
var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PROTO_PATH = "protos/chat.proto";

const REMOTE_SERVER = "127.0.0.1:80";

let username;

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
    
var proto = grpc.loadPackageDefinition(packageDefinition);


let client = new proto.example.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

function startChat() {
    
  let channel = client.join({ user: username, text: "joined" });

  channel.on("data", onData);

  rl.on("line", function(text) {
    client.send({ user: username, text: text }, res => {});
  });
}

function onData(message) {
  if (message.user == username) {
    return;
  }
  console.log(`${message.user}: ${message.text}`);
}

rl.question("What's ur name? ", answer => {

  username = answer;

  startChat();
});
