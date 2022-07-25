<p style="display: flex;">
  <img src="https://github.com/richardverheyen/briscola/blob/master/public/images/example1.PNG?raw=true" width="180">
  <img src="https://github.com/richardverheyen/briscola/blob/master/public/images/example2.PNG?raw=true" width="180">
  <img src="https://github.com/richardverheyen/briscola/blob/master/public/images/example3.PNG?raw=true" width="180">
  <img src="https://github.com/richardverheyen/briscola/blob/master/public/images/example4.PNG?raw=true" width="180">
</p>

# Briscola by Richard Verheyen
Live test environment: https://briscola-fp.web.app/

I built this app so I could have the option to play briscola against my family and friends with consistently randomised cards and some analytics after each game. There will always be more features to add, but for the time being I'm happy with where it's at, as it's only been a holiday project for me. 
This project gave me the opportunity to learn more about Firebase's Firestore database, Firebase Functions and Firebase Auth. I chose React as the language to build it in, because although the initial load time will be slower, I didn't want to introduce more complications when focusing on the game usability. Some things I'm proud of here are the 3d css transformations, realtime updates and that it's a Progressive Web App. 

If you're using the demo version of the app, be aware of Firebase's cold restart time for functions. I didn't feel the need to pay to have my functions readily available, so I stacked every serverside function into one, which keeps server lag to a minimum in gameplay. 


## Prerequisites
git CLI: https://cli.github.com/
firebase CLI: https://firebase.google.com/docs/cli

## Local setup
In your unix terminal, you can run:

`git clone git@github.com:richardverheyen/briscola.git`
`cd briscola`
`yarn`
`firebase init`

### Development

`yarn start`
`firebase init emulators`

### Production

`yarn build`
`firebase deploy`

Happy coding / forking


