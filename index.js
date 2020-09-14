const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(3000);//abre o servidor na porta 3000

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
        var a = 1, b = 0
        var erro = 0, erroTotal = 0; 
        var derErroA=0, derErroB=0;
        var maxIte = 1*msg.maxIte;

        for(var i=1; i<maxIte+1; i++){
            socket.emit('update-value', {a: a, b: b, iteracoes: i, erro: erroTotal});//manda os valores para serem renderizados
            
            erro=0;
            erroTotal=0;
            derErroA=0;
            derErroB=0;
            
            pontos.forEach(function(item){
                erro = ((((item.x*a)+b)-item.y));//erro = valor de f(x) - valor correto de y

                derErroA += (2*erro*item.x);//derivada do erro em relação ao coeficiente angular da reta
                derErroB += (2*erro);//derivada do erro em relação ao coeficiente linear da reta

                erroTotal += erro;
            });

            a = a-(alpha*derErroA);//calcula o valor do coeficiente angular usando a constante alpha para normalizar
            b = b-(beta*derErroB);//calcula o valor do coeficiente linear usando a constante beta para normalizar

            if(erroTotal==0) return; //interrompe caso o erro seja nulo
        }
    });
});


