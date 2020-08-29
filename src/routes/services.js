const express = require('express');
const {accounts,writeJSON} = require('../data');

const router = express.Router();


router.get('/payment',
    (req,res)=>{
        res.render('payment',{account: accounts.credit});
    }
)

router.post('/payment',
    (req,res)=>{
        const amount = parseInt(req.body.amount);
        accounts.credit.balance -= amount;
        accounts.credit.available += amount;

        writeJSON();

        res.render('payment', {message : 'Payment Successful', account: accounts.credit});
    }
)

router.get('/transfer',
    (req,res)=>{
        res.render('transfer');
    }
);

router.post('/transfer',
    (req,res)=>{
        const from = req.body.from;
        const to = req.body.to;
        const amount = parseInt(req.body.amount);

        accounts[from].balance = parseInt(accounts[from].balance)-amount;
        accounts[to].balance = parseInt(accounts[to].balance)+amount;

        writeJSON();


        res.render('transfer',{message:'Transfer Completed'});
    }
)

module.exports = router;