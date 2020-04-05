const keys = require('./keys');

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    database: keys.pgDatabase,
    port: keys.PgPort,
    password: keys.pgPassword,
    host: keys.pgHost
});

pgClient.on('error', () => {
    console.log('PG disconnected');
})

pgClient.query('CREATE TABLE IF NOT EXISTS values(number INT)')
.catch(err => {console.log(err)});

// redis client
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate()

// express route handlers

app.get('/', (req,res) => {
    res.send('Hi');
})

app.get('/values/all', async (req,res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
})

app.get('/values/current', async (req,res) => {
    redisClient.hgetall('values', (err,values) => {
        res.send(values);
    })
})

app.post('/values', async (req,res) => {
    const index = req.body.index;
    if(parseInt(index) > 40) {
        return res.status(422).send('Value too High');
    }
    redisClient.hset('values', index, 'None');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({ working: true });
})

app.listen(5000, err => {
    console.log('Listening on Port 5000');
})

