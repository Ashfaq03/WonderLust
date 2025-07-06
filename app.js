const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");

// const Listing = require("./models/listing.js"); // Import the Listing model
// const wrapAsync = require("./utils/wrapAsync.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js"); // Import the Review model

const session = require("express-session"); // Import express-session for session management
const flash = require("connect-flash"); // Import connect-flash for flash messaging
// Import passport for authentication
const passport = require("passport");
// Import passport-local for local authentication strategy
const LocalStrategy = require("passport-local");
// Import the User model for authentication
const User = require("./models/user.js");

// Routes configuration
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://localhost:27017/wonderlust";

main()
  .then(() => console.log("MongoDB connected!")) // Log success message if MongoDB connects
  .catch((err) => console.log(err)); // Log error if MongoDB connection fails

async function main() {
  await mongoose.connect(MONGO_URL); // Connect to MongoDB using the provided URL
}

app.use(methodOverride("_method")); // Enable HTTP method override for forms (e.g., PUT, DELETE)
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (form submissions)
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the directory for EJS views
app.engine("ejs", ejsMate); // Use ejs-mate for EJS layouts and partials


/*
  Session and authentication configuration.
  This section sets up session management, flash messaging, and Passport.js authentication.
*/
const sessionOptions = {
  secret: "mysupersecret", // Secret key for signing the session ID cookie
  resave: false, // Do not save session if unmodified
  saveUninitialized: true, // Save new sessions that are uninitialized
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Cookie expiration (1 week from now)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Maximum age of the cookie (1 week)
    httpOnly: true, // Prevent client-side JS from accessing the cookie
  },
};

app.get("/", (req, res) => {
  res.send("root route..."); // Respond with a simple message for the root route
});

app.use(session(sessionOptions)); // Enable session management with the specified options
app.use(flash()); // Enable flash messages for displaying alerts

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Enable persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication

passport.serializeUser(User.serializeUser()); // Serialize user instance to session
passport.deserializeUser(User.deserializeUser()); // Deserialize user instance from session

/*
  Middleware to make flash messages and current user available in all views.
  This should be placed after session, flash, and passport middlewares,
  but before route handlers.
*/
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Make success flash messages available in all views
  res.locals.error = req.flash("error"); // Make error flash messages available in all views
  res.locals.currUser = req.user; // Make the current user available in all views
  next(); // Proceed to the
});


//demo user route
// app.get("/demouser", async (req, res) => {
//   let fakeUser = {
//     email: "abc@gmail.com",
//     username: "abc",
//   };
//   let registeredUser = await User.register(fakeUser, "fakepassword");
//   res.send(registeredUser);
// });

//------------Listing route--------
app.use("/listings", listingRoute);

//------------Reveiw route---------
app.use("/listings/:id/reviews", reviewRoute);

//------------User route---------
app.use("/", userRoute);

/*
  Add any additional middleware, routes, or logic here before the catch-all 404 handler.
*/
app.all("*", (req, res, next) => {
  //Catch-all route handler for all undefined routes (404 Not Found)
  next(new ExpressError(404, "Page Not Found"));
});

/*
  Global error handling middleware.
  This should be placed after all routes and before starting the server.
*/
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong! :(" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message);
});

// Define the port number the server will listen on
const PORT = 8080;
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
