const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(3000);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
})

io.on('connection', function (socket) {
    socket.on("send", async function(msg){
        var alpha = 1*msg.iniA;
        var beta = 1*msg.iniB;

        var pontos = msg.pontos;
        var a = 1; 
        var b = 0;
        var erro = 0;
        var erroTotal = 0;
        var derErroA=0;
        var derErroB=0;
        var maxIte = 1*msg.maxIte;

        for(var i=1; i<maxIte+1; i++){
            erro=0;
            erroTotal=0;
            derErroA=0;
            derErroB=0;
            
            pontos.forEach(function(item){
                erro = ((((item.x*a)+b)-item.y));

                derErroA += (2*erro*item.x);
                derErroB += (2*erro);

                erroTotal += Math.pow(erro, 2);
            });

            socket.emit('update-value', {a: a, b: b, iteracoes: i, erro: erroTotal});

            a = a-(alpha*derErroA);
            b = b-(beta*derErroB);

            if(erroTotal==0) return;
        }
    });
});


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 


