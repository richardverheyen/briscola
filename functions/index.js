const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// exports.createUserRecord = functions.auth.user().onCreate((user) => {
//     admin.firestore().collection('users').doc(user.uid).set({
//         // email: user.email,
//         // gameId: ,
//         // name: 
//         hand: [1, 2, 3]
//     })
// });

exports.createGame = functions.https.onRequest(async function(req, res) {
    return cors(req, res, async () => {
        const {id} = await admin.firestore().collection('games').add({
            // host: 
            gameState: "lobby",
        });

        res.send({id});
    });
});

exports.playCard = functions.https.onRequest(async function(req, res) {
    return cors(req, res, () => {
      
        console.log('foo');
        //  res.send(url);
    });
});