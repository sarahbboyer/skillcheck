let express = require("express");
let app = express();
let path = require("path");
const port = 5000;
let security = false;

// using ejs
app.set("view engine", "ejs");

// when you use ejs, use views
app.set("views", path.join(__dirname, "views"));

// get the data from the form
// post: rq.body
// get: req.query 
// you can pass parameters to routes
app.use(express.urlencoded({extended: true}));

// this is your connection to your database
const knex = require("knex") ({
    client : "pg",
    connection : {
        host : "localhost",
        user : "postgres",
        password : "Jimmer32*",
        database : "bucket_list",
        port : 5432,
    }
})

// routes


app.get('/', (req, res) => {
    knex('countries')
    .select(
        'countries.id',
        'countries.country_name',
        'countries.popular_site',
        'countries.capital',
        'countries.population',
        'countries.visited',
    ).orderBy("population")
    // everything from the select statement is going to the pokemon varible
    .then(country => {
        // Render the index.ejs template and pass the data
        // render is used for ejs files
        // index is the name of the file
        res.render('index', { country, security });
        // res.redirect is for routes
    })

    // any time you do a connect statement, paste this
    // put this in when you do your connecting for error testing 
    .catch(error => {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error');
    });
});

// delete 
app.post('/deleteCoun/:id', (req, res) => {
    const id = req.params.id;
    knex('countries')
    // the 'id' refers to the column name
    .where('id', id)
    .del() // Deletes the record with the specified ID
    .then(() => {
    res.redirect('/'); // Redirect to the Pokémon list after deletion
    })
    .catch(error => {
    console.error('Error deleting country:', error);
    res.status(500).send('Internal Server Error');
    });
});

// edit
app.get('/editCount/:id', (req, res) => {
    let id = req.params.id;
    // Query the Pokémon by ID first
    knex('countries')
    // this comesb back as an array
    .where('id', id)
    // this is where it is object conversion, so make your object new name
    .first()
    .then(country => {
    if (!country) {
        return res.status(404).send('Country not found');
    }
    res.render("editCount",{country})
})
    .catch(error => {
    console.error('Error fetching Country for editing:', error);
    res.status(500).send('Internal Server Error');
    });
});

app.post('/editCount/:id', (req, res) => {
    const id = req.params.id;
    // Access each value directly from req.body
    // you can put .touppercase if you want here:
    const country_name = req.body.country_name;
    const popular_site = req.body.popular_site;
    const capital = req.body.capital;
    const population = parseInt(req.body.population); // Convert to integer
    // checkbox
    // this is a character varying so you can use this, if it is boolean, use true/false
    const visited = req.body.visited ? "y":"n"; // Convert checkbox value to boolean
    console.log(visited)
    // Update the Pokémon in the database
    knex('countries')
    .where('id', id)
    // you don't hve to update everything
    .update({
        country_name:country_name,
        popular_site:popular_site,
        capital:capital,
        population:population,
        visited:visited,
    })
    .then(() => {
    // this is the route
    res.redirect('/'); // Redirect to the list of Pokémon after saving
    })
    .catch(error => {
    console.error('Error updating country:', error);
    res.status(500).send('Internal Server Error');
    });
});


app.listen (port, () => console.log("Listening") );