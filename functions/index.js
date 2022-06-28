const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.createHand = functions
  .region("australia-southeast1")
  .auth.user()
  .onCreate((user) => {
    admin.firestore().collection("hands").doc(user.uid).set({
      cards: [],
    });
  });

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
exports.createGame = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    const { id } = await admin.firestore().collection("games").add({
      host: context.auth.uid,
      gameState: "lobby",
    });

    return {
      id,
    };
  });

exports.joinGame = functions
  .region("australia-southeast1")
  .https.onCall(async (data, context) => {
    let gameRef = admin.firestore().collection("games").doc(data.id);
    gameRef
      .update({
        oppo: context.auth.uid,
        playersTurn: context.auth.uid
      })
      .then(() => {
        startGame(data.id);
      });
  });

exports.playCard = functions.https.onRequest(async function (req, res) {
  return cors(req, res, () => {
    console.log("foo");
    //  res.send(url);
  });
});

async function startGame(id) {
    console.log('start the game!', id);
    let gameRef = admin.firestore().collection("games").doc(id);

    const game = await gameRef.get();

    if (game.data().gameState !== "lobby") {
        return;
    }

    let privateRef = gameRef.collection("private").add({
        deck: [1, 2, 3]
    });

    gameRef
      .update({
        gameState: "play",
      })
}