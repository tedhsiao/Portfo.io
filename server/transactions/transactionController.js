var Transaction = require('../../db/models').Transaction;
var Portfolio = require('../../db/models').Portfolio;

// make a transaction
module.exports.buySell = function(req, res){
  Transaction.create(req.body).then(function(transaction){

    Portfolio.findOne({ where: {
        UserId: req.body.userId,
        leagueId: req.body.leagueId
      }
    })
    .then(function(portfolio){
      var amount = transaction.price*transaction.shares
      console.log('amount', amount)

      // if true, add the amount else substract the amount from balance
      transaction.buysell ? portfolio.balance += amount : portfolio.balance -= amount;
      console.log('balance', transaction.buysell, portfolio.balance)

      //Setting the transaction's PortfolioId
      transaction.PortfolioId = portfolio.id;

      // Saving both instances
      transaction.save();
      portfolio.save();

      res.send(transaction);
    })
    .catch(function(err){
      res.send('Error: ', err);
    });

  })
  .catch(function(err){
      res.send('Error: ', err);
    });
}

module.exports.getTransactions = function(req, res){

  Portfolio.findOne({ where: {
    UserId: req.params.userId,
    leagueId: req.params.leagueId
  }}).then(function(portfolio){

    Transaction.findAll({ where: {
      PortfolioId: portfolio.id
    }}).then(function(transactions){

      // removing duplicates, adding the sum of all trades for same company
      // var stock = reduceTransactions(transactions);

      // res.send(stocks);

      res.send(transactions)
    })
    .catch(function(err){
      res.send("There was an error: ", err);
    })
    
  })
  .catch(function(err){
    res.send("There was an error: ", err);
  })

}

function reduceTransactions(transactions){
  // removing duplicates, adding the sum of all trades for same company
  var storage = {}
  var finalArray = [];

  transactions.forEach(function(transaction){
    if (!storage[transaction]){
      storage[transaction.symbol] = [transaction];
    } else {
      storage[transaction.symbol].push(transaction);
    }
  });

  for (var key in storage){
    var temp = {};
    temp.price = 0;
    temp.shares = 0;
    storage[key].forEach(function(transaction){

      // checks if the transaction was bought (filtering sold)
      if (transaction.buysell){
        temp.symbol = transaction.symbol;
        temp.price += transaction.price;
        temp.shares += transaction.shares;
      }

    });

    // adds it to the array if the values exist
    if (temp.symbol) { finalArray.push(temp) }

  }

  return finalArray;

}


// //Get all transactions of Portfolio by passing in portfolioID
// module.exports.getTransactionsByPortfolioId = function(req, res){
//   var id = parseInt(req.body.id);

//   Transaction.findAll({ where: { portfolioId === id }}).then(function(transactions){
//     if(transactions){
//       res.json(sessions);
//     }else{
//       console.log('No transaction found!');
//       res.status(404);
//       res.end();
//     } 
//   })
//   .catch(function(err) {
//     console.error('Error getting users:', err);
//     res.end();
//   });
// }

// //Get all transactions
// module.exports.getAllTransactions = function(req,res){
//   Transaction.findAll({}).then(function(transactions){
//     if(transactions){
//       res.json(transactions);
//     }else{
//       console.log('No user found!');
//       res.status(404);
//       res.end();
//     }
//   })
//   .catch(function(err) {
//     console.error('Error getting users:', err);
//     res.end();
//   });
// }

