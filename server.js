var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})





app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const port = process.env.PORT || '443'
app.set('port', port);


var dbUrl = process.env.DB_INFO

app.get(process.env.ROUTE_1, async (req, res) => {
    await Message.find({})
    .then((log) => {(res.send(log));})
    .catch((err) => {
        console.log(err)
    })
})


app.get(process.env.ROUTE_1 + '/:user', async (req, res) => {
  var user = req.params.user
  await Message.find({name: user})
  .then((foundUser) => {res.send(foundUser)})
  .catch((err) => console.log(err))
})


app.post(process.env.ROUTE_1, async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
      console.log('saved');

    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})


io.on('connection', (socket) =>{
  console.log('a user is connected')
  //var ipS = socket.handshake.headers["client-ip"];
  //console.log(ipS)

})

mongoose.connect(dbUrl) 


var server = http.listen(port, () => {
  console.log('server is running on port', port); 
});




// https://github.com/amkurian/simple-chat  --  https://www.freecodecamp.org/news/simple-chat-application-in-node-js-using-express-mongoose-and-socket-io-ee62d94f5804/
