const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.set('views',path.join(__dirname, '/views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extender:true}));

const accountData = fs.readFileSync('src/json/accounts.json',{encoding:'utf8'});
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync('src/json/users.json',{encoding:'utf8'});
const users = JSON.parse(userData);



app.get('/',
    (req, res)=>{
        res.render('index',{title: 'Account Summary', accounts: accounts});
    }
);

app.get('/savings',
    (req,res)=>{
        res.render('account',{account: accounts.savings});
    }
)

app.get('/checking',
    (req,res)=>{
        res.render('account',{account: accounts.checkings});
    }
)

app.get('/credit',
    (req,res)=>{
        res.render('account',{account: accounts.credit});
    }
)

app.get('/profile',
    (req,res)=>{
        res.render('profile', {user:users[0]});
    }
)

app.get('/payment',
    (req,res)=>{
        res.render('payment',{account: accounts.credit});
    }
)

app.post('/payment',
    (req,res)=>{
        const amount = parseInt(req.body.amount);
        accounts.credit.balance -= amount;
        accounts.credit.available += amount;

        const accountsJSON = JSON.stringify(accounts);

        fs.writeFileSync(path.join(__dirname, 'json','accounts.json'), accountsJSON, 'utf8');

        res.render('payment', {message : 'Payment Successful', account: accounts.credit});
    }
)

app.get('/transfer',
    (req,res)=>{
        res.render('transfer');
    }
);

app.post('/transfer',
    (req,res)=>{
        const from = req.body.from;
        const to = req.body.to;
        const amount = parseInt(req.body.amount);

        accounts[from].balance = parseInt(accounts[from].balance)-amount;
        accounts[to].balance = parseInt(accounts[to].balance)+amount;

        const accountsJSON = JSON.stringify(accounts);

        fs.writeFileSync(path.join(__dirname, 'json','accounts.json'), accountsJSON, 'utf8');
        fs.writeFileSync(path.join(__dirname,'json/accounts_backup.json'),accountData,{encoding:'utf8'});

        res.render('transfer',{message:'Transfer Completed'});
    }
)

app.listen(3000, ()=>{
    console.log('PS Project Running on port 3000!');
})