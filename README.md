Check out the demo! "https://olympiandiscourse.up.railway.app/"
Express Node.js back-end message board website demonstrationg CRUD based operations where users can signup, log in, make posts to be displayed in a chatboard and delete posts if they are registered as an admin user.
Posts are saved into MongoDb, and processed with Mongoose. Log in authentication is handled through passport and bcryptJS to hash & salt passwords in order to keep them secret and private. Log in session is handled by express-session. This project follows a Router/Controller/Model structure.
