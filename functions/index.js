const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// exports.createGame = functions.https.onRequest(async function(req, res) {
//     return cors(req, res, async () => {
        
//         const {id} = await admin.firestore().collection('games').add({
//             // host: 
//             gameState: "lobby",
//         });

//         res.send({id});
//     });
// });

// https://stackoverflow.com/questions/52444812/getting-user-info-from-request-to-cloud-function-in-firebase
// https://firebase.google.com/docs/functions/callable
exports.createGame = functions.region('australia-southeast1').https.onCall(async (data, context) => {
    const { id } = await admin.firestore().collection('games').add({
        host: context.auth.uid,
        gameState: "lobby",
    });

    return {
        id
    };
});

exports.playCard = functions.https.onRequest(async function(req, res) {
    return cors(req, res, () => {
      
        console.log('foo');
        //  res.send(url);
    });
});

exports.myStorageFunction = functions
    .region('europe-west1')
    .storage
    .object()
    .onFinalize((object) => {
      // ...
    });