// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.

// ###############################################################################
//
// The Status codes will be defined here as constant values

const responseCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOCONTENT: 204,
    ERROR: 400,
    NOTFOUND: 404
}

// Error Response is Defined Here

const errorResponse = (res, message = "Unprocessable error!", code = responseCode.ERROR) => {
    return res.status(code).json({
        "status": "Exception",
        "message": message
    })

}


// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json())

// We use the express validator to have a good way to handle body formats
const { body, validationResult, query } = require('express-validator');



// ###############################################################################
// Routes
//
// ###############################################################################

// Index Route
app.get('/',
query("page").default(1),
function (req, res) {


    if (isNaN(req.query["page"])) {
        return errorResponse(res, "Page number has to be a number")
    }
    db.all(`SELECT * FROM phones LIMIT 5 OFFSET ?`, req.query["page"] ,function (err, rows) {
        // # Return db response as JSON
        return res.status(responseCode.OK).json(rows)
    });
});

// Show Route, Gets a specific phone
app.get('/:phone_id', function (req, res) {
    phoneId = req.params["phone_id"]
    if (isNaN(phoneId)) {
        return errorResponse(res, "Phone ID is not a number.")
    }
    db.all(`SELECT * FROM phones WHERE id=?`, [req.params["phone_id"]], function (err, rows) {
        if (rows.length == 0) {
            return errorResponse(res, "No Phone found with the specified ID", responseCode.NOTFOUND)
        }

        // # Return db response as JSON
        return res.json(rows[0])
    });
});

// Creates a new Phone
app.post('/',
    body("brand").isLength({ max: 20 }).isString().withMessage("Must be a String"),
    body("model").isLength({ max: 20 }).isString().withMessage("Must be a String"),
    body("os").isLength({ max: 10 }).isString().withMessage("Must be a String"),
    body("image").isURL().withMessage("Must be a Url"),
    body("screensize").isFloat().withMessage("Must be a Float Value"),
    function (req, res) {
            const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors)
        }

        db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
            [req.body["brand"], req.body["model"], req.body["os"], req.body["image"], req.body["screensize"]]
            , function (err, rows) {
                if (err) {
                    errorResponse(res, err)
                } else {
                    db.all(`SELECT * FROM phones WHERE id=?`, [this.lastID], function (err, rows) {
                        if (rows.length == 0) {
                            return errorResponse(res, "No Phone found with the specified ID", responseCode.NOTFOUND)
                        }

                        // # Return db response as JSON
                        return res.status(responseCode.CREATED).json(rows[0])
                    });
                }


                // # Return db response as JSON
            });
    });

app.put('/:phone_id',
    body("brand").isLength({ max: 20 }).isString().optional({ nullable: true, checkFalsy: true }).withMessage("Must be a String"),
    body("model").isLength({ max: 20 }).isString().optional({ nullable: true, checkFalsy: true }).withMessage("Must be a String"),
    body("os").isLength({ max: 10 }).isString().optional({ nullable: true, checkFalsy: true }).withMessage("Must be a String"),
    body("image").isURL().optional({ nullable: true, checkFalsy: true }).withMessage("Must be a Url"),
    body("screensize").isFloat().optional({ nullable: true, checkFalsy: true }).withMessage("Must be a Float Value"),
    function (req, res) {

        allowedKeys = ["brand", "model", "os", "image", "screensize"];

        updatingValues = Object.keys(req.body).filter((item) => allowedKeys.includes(item))
        if (updatingValues.length === 0){
            return errorResponse(res, "It seems you didn't update any allowed attributes of the following item. You have to update one of the following values with this method. 'brand', 'model', 'os', 'image', 'screensize' ")
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors)
        }
        db.all(`SELECT * FROM phones WHERE id=?`, [req.params["phone_id"]], function (err, rows) {
            if (rows.length == 0) {
                return errorResponse(res, "No Phone found with the specified ID", responseCode.NOTFOUND)
            }

            // We are merging the current data with existing rows.
            var updatedPhone = { ...rows[0], ...req.body }

            db.run(`UPDATE phones SET brand = ?, model = ? , os = ?, image = ?, screensize = ? WHERE id = ?`,
                [updatedPhone["brand"], updatedPhone["model"], updatedPhone["os"], updatedPhone["image"], updatedPhone["screensize"], req.params["phone_id"]],
                function (err, rows) {
                    if (err) {
                        errorResponse(res, err)
                    } else {
                        db.all(`SELECT * FROM phones WHERE id=?`, [req.params["phone_id"]], function (err, rows) {
                            if (rows.length == 0) {
                                return errorResponse(res, "No Phone found with the specified ID", responseCode.NOTFOUND)
                            }

                            // # Return db response as JSON

                            return res.status(responseCode.OK).json(rows[0])
                        });
                    }
                });
        });
    });

app.delete('/:phone_id', function (req, res) {
    db.all(`SELECT * FROM phones WHERE id=?`, [req.params["phone_id"]], function (err, rows) {
        if (err) {
            return errorResponse(res, err)
        }
        else if (rows.length !== 1) {
            return errorResponse(res, "The specified phone is not found")
        }
        db.all(`DELETE FROM phones WHERE id = ?`, [req.params["phone_id"]], function (err, rows) {
            if (err) {
                return errorResponse(res, err)
            }

            return res.status(responseCode.NOCONTENT).json()
        });

    });
});






// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in.");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    var db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the phones database.');
    });
    // Create our phones table if it does not exist already:
    db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
        db.all(`select count(*) as count from phones`, function (err, result) {
            if (result[0].count == 0) {
                db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
                    ["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
                console.log('Inserted dummy phone entry into empty database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}