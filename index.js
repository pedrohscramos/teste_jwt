require("dotenv-safe").config();
const jwt = require('jsonwebtoken');


const http = require('http');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json({ message: "Tudo OK por aqui!" });
})

app.get('/clientes', verifyJWT, (req, res, next) => {
    console.log("Retornou todos os clientes!");
    res.json([{id: 1, nome:'Pedro'}]);
})

app.post('/login', (req, res, next) => {
    if(req.body.user === 'Pedro' && req.body.password === '123'){
        const id = 1;
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300
        });
        return res.json({ auth:true, token: token });
    }
    res.status(500).json({ message: 'Login inválido' });
})

app.post('/logout', function(req, res){
    res.json({ auth: false, token:null });
})

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({ auth: false, message: 'Sem token' });

    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err) return res.status(500).json({ auth: false, message: 'Falha no token' });

        req.userId = decoded.id;
        next();
    });
}

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor rodando na porta 3000...");