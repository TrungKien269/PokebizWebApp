var express = require('express');
const http = require('http');

var app = express();
const { mongoose } = require('./db.js');
const mongo = require('mongodb');
const path = require('path');
const url = require('url');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const multer = require('multer');
const ent = require('ent');
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const storageBall = multer.diskStorage({
    destination: './public/images/balls',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const uploadBall = multer({
    storage: storageBall,
    limits: {
        fileSize: 1000000
    },

    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }

}).single('files');

const storageTool = multer.diskStorage({
    destination: './public/images/toolboxes',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const uploadTool = multer({
    storage: storageTool,
    limits: {
        fileSize: 1000000
    },

    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }

}).single('files');

app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: 'ssshhhhh',
    key: 'userid',
    expires: new Date(Date.now() + (60 * 60 * 35)),
    cookie: {
        maxAge: 2000000,
        expires: 600000
    },
    saveUninitialized: true,
    resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(3000);
// app.listen(3000);
var chatbox = new Array();

app.get('/', function (req, res) {
    if (req.session.userid != undefined) {
        return res.redirect('/choose');
    }
    else {
        var error = "";
        res.render('login', { error: error });
    }
});

app.get('/choose', function (req, res) {
    if (req.session.userid == undefined) {
        return res.redirect('/');
    }

    var avatar = require('./models/avatars');
    avatar.findOne({ account_id: parseInt(req.session.userid) })
        .exec(function (err, doc) {
            if (doc != null) {
                var Account = require('./models/accounts');
                Account.aggregate([
                    {
                        $lookup:
                        {
                            from: "avatars",
                            localField: "_id",
                            foreignField: "account_id",
                            as: "Avatar"
                        }
                    },
                    {
                        $lookup:
                        {
                            from: "levelaccounts",
                            localField: "_id",
                            foreignField: "_id",
                            as: "Level"
                        }
                    },
                    {
                        $match: { "_id": parseInt(req.session.userid) }
                    },
                    {
                        $limit: 1
                    }
                ]).exec(function (err, doc) {
                    if (!err) {
                        var account_ava = doc;
                        var character_id = doc[0].Avatar[0].character_id.toString();
                        var level = doc[0].Level[0].level;
                        var exp = doc[0].Level[0].exp;

                        var Character = require('./models/characters');
                        Character.findOne({ _id: character_id }).exec(function (err, doc) {
                            var character = doc;
                            res.render('getCharacter', {
                                data: account_ava, level: level,
                                character: character, exp: exp, 
                                chatbox: req.session.chatbox
                            });
                        });
                    }
                });
            }
            else {
                res.redirect('/create');
            }
        });
});

app.get('/character', function (req, res) {
    res.render('getCharacter');
});

app.post('/getPokemons', function (req, res) {
    var Pokemon = require('./models/pokemons');
    Pokemon.find().exec(function (err, doc) {
        if (!err) {
            res.send(doc)
        }
    });
});

app.get('/play/:character', function (req, res) {
    if (req.session.userid == undefined) {
        return res.redirect('/');
    }

    var Pokemon = require('./models/pokemons');
    var UserBalls = require('./models/userballs');
    var UserToolboxes = require('./models/usertoolboxes');
    Pokemon.find().exec(function (err, doc) {
        if (!err) {
            var pokelist = JSON.stringify(doc);
            UserToolboxes.find({
                "toolbox_id":
                {
                    $in:
                        [
                            10, 11, 12, 13
                        ]
                }, "account_id": parseInt(req.session.userid)
            }).exec(function (err, doc) {
                if (!err) {
                    var toolboxes = doc;
                    UserBalls.find({ account_id: parseInt(req.session.userid) }).exec(function (err, doc) {
                        if (!err) {
                            balls = doc;
                            res.render('play',
                                {
                                    pokelist: pokelist, toolboxes: toolboxes,
                                    balls: balls, character: req.params.character
                                });
                        }
                    });
                }
            });
        }
    });
});

app.post('/updateAssets', function (req, res) {
    var UserBalls = require('./models/userballs');
    var UserToolboxes = require('./models/usertoolboxes');
    var UserPokedex = require('./models/userpokedexs');
    var UserPokemons = require('./models/userpokemons');
    var Level = require('./models/levels');
    var LevelAccount = require('./models/levelaccounts');
    var Balls = [parseInt(req.body.Ball1), parseInt(req.body.Ball2),
    parseInt(req.body.Ball3), parseInt(req.body.Ball4)];
    var Berries = [parseInt(req.body.Berry10), parseInt(req.body.Berry11),
    parseInt(req.body.Berry12), parseInt(req.body.Berry13)];
    var date = new Date();
    var caughtDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var userpokemon = new UserPokemons({
        account_id: parseInt(req.session.userid),
        pokemon_id: parseInt(req.body.PokeID),
        caught_time: caughtDate
    });
    UserPokemons.collection.insert(userpokemon, function (err, doc) {
        if (err) {
            res.send(err);
        }
    });

    for (var i = 0; i < Balls.length; i++) {
        UserBalls.findOneAndUpdate(
            { account_id: parseInt(req.session.userid), ball_id: i + 1 },
            {
                $set: {
                    account_id: parseInt(req.session.userid),
                    ball_id: i + 1,
                    quantity: Balls[i]
                }
            }
        ).exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
        });
    }

    for (var j = 0; j < Berries.length; j++) {
        UserToolboxes.findOneAndUpdate(
            { account_id: parseInt(req.session.userid), toolbox_id: j + 10 },
            {
                $set: {
                    account_id: parseInt(req.session.userid),
                    toolbox_id: j + 10,
                    quantity: Berries[j]
                }
            }
        ).exec(function (err, doc) {
            if (err) {
                res.send(err);
            }
        });
    }

    UserPokedex.findOne({
        account_id: parseInt(req.session.userid),
        pokemon_id: parseInt(req.body.PokeID)
    }).exec(function (err, doc) {
        if (doc == null) {
            var pokedex = new UserPokedex({
                account_id: parseInt(req.session.userid),
                pokemon_id: parseInt(req.body.PokeID)
            });
            UserPokedex.collection.insert(pokedex, function (err, doc) {
                if (err) {
                    res.send(err);
                }
                else {
                }
            });
            LevelAccount.findOne({ _id: parseInt(req.session.userid) }).exec(function (err, doc) {
                // var data = doc;
                if (!err) {
                    var exp = parseInt(doc.exp) + 600;
                    var level = parseInt(doc.level);
                    Level.findOne({ _id: parseInt(level) + 1 }).exec(function (err, doc) {
                        if (!err) {
                            if (exp >= doc.exp) {
                                level = parseInt(doc._id);
                                LevelAccount.findOneAndUpdate({ _id: parseInt(req.session.userid) },
                                    {
                                        $set: {
                                            level: level,
                                            exp: exp
                                        }
                                    }).exec(function (err, doc) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        else {
                                            // res.send(doc);
                                        }
                                    });
                            }
                            else {
                                level = parseInt(doc._id) - 1;
                                LevelAccount.findOneAndUpdate({ _id: parseInt(req.session.userid) },
                                    {
                                        $set: {
                                            level: level,
                                            exp: exp
                                        }
                                    }).exec(function (err, doc) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        else {
                                            // res.send(doc);
                                        }
                                    });

                            }
                        }
                    });
                }
            });
        }
        else {
            LevelAccount.findOne({ _id: parseInt(req.session.userid) }).exec(function (err, doc) {
                // var data = doc;
                if (!err) {
                    var exp = parseInt(doc.exp) + 200;
                    var level = parseInt(doc.level);
                    Level.findOne({ _id: parseInt(level) + 1 }).exec(function (err, doc) {
                        if (!err) {
                            if (exp >= doc.exp) {
                                level = parseInt(doc._id);
                                LevelAccount.findOneAndUpdate({ _id: parseInt(req.session.userid) },
                                    {
                                        $set: {
                                            level: level,
                                            exp: exp
                                        }
                                    }).exec(function (err, doc) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        else {
                                            // res.send(doc);
                                        }
                                    });
                            }
                            else {
                                level = parseInt(doc._id) - 1;
                                LevelAccount.findOneAndUpdate({ _id: parseInt(req.session.userid) },
                                    {
                                        $set: {
                                            level: level,
                                            exp: exp
                                        }
                                    }).exec(function (err, doc) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        else {
                                            // res.send(doc);
                                        }
                                    });

                            }
                        }
                    });
                }
            });
        }
    });
    res.send("Success");
});

app.get('/catch/:pokeid/:userid', function (req, res) {
    var Pokemon = require('./models/pokemons');
    var UserBalls = require('./models/userballs');
    var UserToolboxes = require('./models/usertoolboxes');
    Pokemon.findOne({ _id: req.params.pokeid }).exec(function (err, doc) {
        if (!err) {
            // res.render('catchPokemon',
            // { pokemon: doc, userid: req.params.userid });
            var pokemon = doc;
            // res.send(pokemon)
            UserToolboxes.find({
                "toolbox_id":
                {
                    $in:
                        [
                            10, 11, 12, 13
                        ]
                }, "account_id": parseInt(req.params.userid)
            }).exec(function (err, doc) {
                if (!err) {
                    var toolboxes = doc;
                    UserBalls.find({ account_id: parseInt(req.params.userid) }).exec(function (err, doc) {
                        if (!err) {
                            balls = doc;
                            res.render('catchPokemon',
                                {
                                    pokemon: pokemon, userid: req.params.userid,
                                    toolboxes: toolboxes, balls: balls
                                });
                            // res.send(toolboxes)
                        }
                    });
                }
            });
        }
    });
});

app.get('/login', function (req, res) {
    res.render('login', { error: "" });
});

app.post('/login', function (req, res, next) {
    var account = require('./models/accounts');
    var username = req.body.username
    var password = req.body.password;
    var hash = md5(username + password);
    account.findOne({
        username: username, password: hash
    }).exec(function (err, doc) {
        if (!err) {
            if (doc != null) {
                if (parseInt(doc.status) == 0) {
                    res.render('login', { error: "Block" });
                }
                else {
                    var userid = parseInt((doc._id).toString());
                    req.session.userid = userid;
                    req.session.chatbox = new Array();
                    var avatar = require('./models/avatars');
                    avatar.findOne({ account_id: userid })
                        .exec(function (err, doc) {
                            if (doc != null) {
                                res.redirect('/choose');
                            }
                            else {
                                res.redirect('/create');
                            }
                        });
                }
            }
            else {
                res.render('login', { error: "Fail" });
            }
        }
        else {
            console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
        }
    });
});

app.get('/create', function (req, res) {
    res.render('createCharacter', { userid: req.session.userid });
});

app.post('/saveAvatar', function (req, res) {
    var Avatar = require('./models/avatars');
    var Account = require('./models/accounts');
    Account.findOne({ nickname: req.body.nickname }).exec(function (err, doc) {
        if (doc != null) {
            res.send('Used');
        }
        else {
            Account.findOne({ _id: req.session.userid }).exec(function (err, doc) {
                if (!err) {
                    var account = doc;
                    Account.updateOne({ _id: account._id },
                        {
                            username: account.username,
                            password: account.password,
                            nickname: req.body.nickname,
                            created_date: account.created_date
                        })
                        .exec(function (err, doc) {
                            if (!err) {
                            }
                            else {
                                console.log("Error in retriving Avatar: " + JSON.stringify(err, undefined, 2));
                            }
                        });
                }
                else {
                    console.log("Error in retriving Avatar: " + JSON.stringify(err, undefined, 2));
                }
            });
            var ava = new Avatar({
                account_id: parseInt(req.session.userid),
                character_id: parseInt(req.body.characterid),
                changing_time: req.body.time
            });
            Avatar.collection.insertOne(ava, function (err, doc) {
                if (!err) {
                    req.session.chatbox = new Array();
                    res.send("Success");
                }
                else {
                    console.log("Error in retriving Avatar: " + JSON.stringify(err, undefined, 2));
                }
            });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error in removing session " + JSON.stringify(err, undefined, 2));
        }
        // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/');
    });
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/test/:name', function (req, res) {
    var ItemBall = require('./models/itemBalls');
    var ItemTool = require('./models/itemToolboxes');
    var name = req.params.name;
    ItemBall.aggregate([
        {
            $lookup:
            {
                from: "pokeballs",
                localField: "_id",
                foreignField: "_id",
                as: "Pokeballs"
            }
        },
        { $match: { "Pokeballs.name": { $regex: ".*" + name + ".*" } } }
    ]).exec(function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    });
    ItemTool.aggregate([
        {
            $lookup:
            {
                from: "toolboxes",
                localField: "_id",
                foreignField: "_id",
                as: "Toolboxes"
            }
        },
        { $match: { "Toolboxes.name": { $regex: ".*" + name + ".*" } } }
    ]).exec(function (err, doc) {
        if (!err) {
            res.send(doc);
        }
    });
});

app.get('/forgot/:email', function (req, res) {
    var User = require('./models/users');
    var Account = require('./models/accounts');
    User.findOne({ email: req.params.email }).exec(function (err, doc) {
        if (!err) {
            var accountid = doc.account_id;
            Account.findOne({ _id: parseInt(accountid) }).exec(function (err, doc) {
                if (!err) {
                    var password = doc.password;
                    var nodemailer = require('nodemailer');
                    var smtpTransport = nodemailer.createTransport({
                        service: 'gmail',
                        host: "mail.smtp2go.com",
                        port: 2525,
                        requireTLS: true,
                        auth: {
                            user: "RyanKien",
                            pass: "kien38951692"
                        }
                    });

                    smtpTransport.sendMail({
                        from: "trungkien2691998@gmail.com",
                        to: "longprodeptrai48@gmail.com",
                        subject: "Forgot Password",
                        text: "Your password is: " + password
                    }, function (error, response) {
                        if (error) {
                            console.log(error);
                            res.send(error);
                        } else {
                            console.log("Message sent: " + response.message);
                            res.send(response.message);
                        }
                    });
                }
            });
        }
    });
});

app.post('/register', function (req, res) {
    var Account = require('./models/accounts');
    var User = require('./models/users');
    var LevelAccount = require('./models/levelaccounts');
    var UserToolboxes = require('./models/usertoolboxes');
    var DefaultUserToolboxes = require('./models/default-usertoolboxes');
    var UserBalls = require('./models/userballs');
    var DefaultUserBalls = require('./models/default-userballs');
    var Finance = require('./models/finance');
    var NextAcc = 0;
    var NextUser = 0;
    var date = new Date();
    var createdDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var fullname = req.body.firstname + " " + req.body.lastname;
    var hash = md5(req.body.username + req.body.password);
    Account.countDocuments({}).exec(function (err, doc) {
        NextAcc = doc + 1;
        var acc = new Account({
            _id: NextAcc,
            username: req.body.username,
            password: hash,
            nickname: "",
            created_date: req.params.createdDate
        });
        Account.findOne({ username: req.body.username }).exec(function (err, doc) {
            var check = doc;
            if (check != null) {
                res.redirect('/register');
            }
            else {
                Account.collection.insertOne(acc, function (err, doc) {
                    if (!err) {
                        req.session.userid = parseInt(NextAcc);
                        User.countDocuments({}).exec(function (err, doc) {
                            NextUser = doc + 1;
                            var user = new User({
                                _id: NextUser,
                                fullname: fullname,
                                age: parseInt(req.body.age),
                                sex: req.body.sex,
                                email: req.body.email,
                                account_id: parseInt(NextAcc.toString()),
                            });
                            User.collection.insertOne(user, function (err, doc) {
                                if (!err) {
                                    //Tạo pokeballs sẵn
                                    var balls = DefaultUserBalls.GetDefaultUserBalls(NextAcc);
                                    UserBalls.collection.insert(balls, function (err, doc) {
                                        if (!err) {
                                        }
                                        else {
                                            console.log("Error in retriving Account: " + JSON.stringify(err, undefined, 2));
                                        }
                                    });
                                    //Tạo toolboxes sẵn
                                    var Toolboxes = DefaultUserToolboxes.GetDefaultUserToolboxes(NextAcc);
                                    UserToolboxes.collection.insertMany(Toolboxes, function (err, doc) {
                                        if (!err) {
                                        }
                                        else {
                                            console.log("Error in retriving Account: " + JSON.stringify(err, undefined, 2));
                                        }
                                    });
                                    //Tạo level 0 cho account
                                    var lv = new LevelAccount({
                                        _id: NextAcc,
                                        level: 1,
                                        exp: 0
                                    });
                                    LevelAccount.collection.insertOne(lv, function (err, doc) {
                                        if (!err) {
                                            // res.send(doc);
                                        }
                                    });
                                    //Tạo tiền ảo Pokecoins cho account
                                    var finance = new Finance({
                                        _id: NextAcc,
                                        pokecoins: 0
                                    });
                                    Finance.collection.insertOne(finance, function (err, doc) {
                                        if (!err) {
                                        }
                                    });
                                    res.redirect('/create');
                                }
                                else {
                                    console.log("Error in retriving User: " + JSON.stringify(err, undefined, 2));
                                }
                            });
                        });

                    }
                    else {
                        console.log("Error in retriving Account: " + JSON.stringify(err, undefined, 2));
                    }
                });
            }
        });
    });
});

app.get('/usertoolboxes', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var UserToolboxes = require('./models/usertoolboxes');
    var Avatar = require('./models/avatars');
    UserToolboxes.aggregate([
        {
            $lookup:
            {
                from: "toolboxes",
                localField: "toolbox_id",
                foreignField: "_id",
                as: "Toolboxes"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        if (!err) {
            // res.send(doc[0]);
            var data = doc;
            // res.render('usertoolboxes', { data: doc });
            Avatar.aggregate([
                {
                    $lookup:
                    {
                        from: "characters",
                        localField: "character_id",
                        foreignField: "_id",
                        as: "Character"
                    }
                },
                {
                    $match:
                    {
                        "account_id": parseInt(req.session.userid)
                    }
                }
            ]).exec(function (err, doc) {
                if (!err) {
                    var avatar = doc[0].Character[0].name;
                    res.render('usertoolboxes', { data: data, avatar: avatar });
                }
            });
        }
        else {
            console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
        }
    });
});

app.get('/userballs', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var UserBalls = require('./models/userballs');
    var Avatar = require('./models/avatars');
    UserBalls.aggregate([
        {
            $lookup:
            {
                from: "pokeballs",
                localField: "ball_id",
                foreignField: "_id",
                as: "Balls"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        if (!err) {
            // res.send(doc[0]);
            var data = doc;
            // res.render('userballs', { data: doc });
            Avatar.aggregate([
                {
                    $lookup:
                    {
                        from: "characters",
                        localField: "character_id",
                        foreignField: "_id",
                        as: "Character"
                    }
                },
                {
                    $match:
                    {
                        "account_id": parseInt(req.session.userid)
                    }
                }
            ]).exec(function (err, doc) {
                if (!err) {
                    var avatar = doc[0].Character[0].name;
                    res.render('userballs', { data: data, avatar: avatar });
                }
            });
        }
        else {
            console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
        }
    });
});

app.get('/userpokedex', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var UserPokedex = require('./models/userpokedexs');
    var Avatar = require('./models/avatars');
    var Pokemon = require('./models/pokemons');
    UserPokedex.aggregate([
        {
            $lookup:
            {
                from: "pokemons",
                localField: "pokemon_id",
                foreignField: "_id",
                as: "Pokemon"
            }
        },
        {
            $lookup:
            {
                from: "pokemonstats",
                localField: "pokemon_id",
                foreignField: "pokemon_id",
                as: "Stats"
            }
        },
        {
            $lookup:
            {
                from: "pokemontypes",
                localField: "pokemon_id",
                foreignField: "pokemon_id",
                as: "PokemonTypes"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        if (!err) {
            // var indexRow = [0, 4, 8, 12, 16];
            var indexRow = [0];
            var row = parseInt(doc.length / 4);
            var full = doc.length % 4;
            for (var i = 1; i <= doc.length; i++) {
                if (i % 4 == 0) {
                    indexRow.push(i);
                }
            }
            if (doc.length < 4) {
                indexRow.push(doc.length);
            }
            // res.send(row.toString())
            // var data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
            // res.render('userpokedex', {data: data, row: 2 + 1, indexRow: indexRow, 
            //             full: 1});
            // res.render('userpokedex', {
            //     data: doc, row: row + 1, indexRow: indexRow,
            //     full: full
            // });
            // res.send((indexRow.length).toString())
            var data = doc;
            Avatar.aggregate([
                {
                    $lookup:
                    {
                        from: "characters",
                        localField: "character_id",
                        foreignField: "_id",
                        as: "Character"
                    }
                },
                {
                    $match:
                    {
                        "account_id": parseInt(req.session.userid)
                    }
                }
            ]).exec(function (err, doc) {
                if (!err) {
                    var avatar = doc[0].Character[0].name;
                    Pokemon.find().exec(function (err, doc) {
                        if (!err) {
                            var PokeList = doc;
                            res.render('userpokedex', {
                                data: data, avatar: avatar,
                                row: row + 1, indexRow: indexRow, full: full,
                                pokelist: PokeList
                            });
                        }
                    });
                    // res.render('userpokedex', { data: data, avatar: avatar, 
                    //     row: row + 1, indexRow: indexRow, full: full});
                    // res.send(indexRow)
                }
                else {
                    console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
                }
            });
        }
        else {
            console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
        }
    });
});

app.get('/userpokemons', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var UserPokemons = require('./models/userpokemons');
    var Avatar = require('./models/avatars');
    var Pokemon = require('./models/pokemons');
    UserPokemons.aggregate([
        {
            $lookup:
            {
                from: "pokemons",
                localField: "pokemon_id",
                foreignField: "_id",
                as: "Pokemon"
            }
        },
        {
            $lookup:
            {
                from: "pokemonstats",
                localField: "pokemon_id",
                foreignField: "pokemon_id",
                as: "Stats"
            }
        },
        {
            $lookup:
            {
                from: "pokemontypes",
                localField: "pokemon_id",
                foreignField: "pokemon_id",
                as: "PokemonTypes"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        if (!err) {
            // var indexRow = [0, 4, 8, 12, 16];
            var indexRow = [0];
            var row = parseInt(doc.length / 4);
            var full = doc.length % 4;
            for (var i = 1; i <= doc.length; i++) {
                if (i % 4 == 0) {
                    indexRow.push(i);
                }
            }
            if (doc.length < 4) {
                indexRow.push(doc.length);
            }
            // res.send(row.toString())
            // var data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
            // res.render('userpokedex', {data: data, row: 2 + 1, indexRow: indexRow, 
            //             full: 1});
            // res.render('userpokedex', {
            //     data: doc, row: row + 1, indexRow: indexRow,
            //     full: full
            // });
            // res.send((indexRow.length).toString())
            var data = doc;
            Avatar.aggregate([
                {
                    $lookup:
                    {
                        from: "characters",
                        localField: "character_id",
                        foreignField: "_id",
                        as: "Character"
                    }
                },
                {
                    $match:
                    {
                        "account_id": parseInt(req.session.userid)
                    }
                }
            ]).exec(function (err, doc) {
                if (!err) {
                    var avatar = doc[0].Character[0].name;
                    Pokemon.find().exec(function (err, doc) {
                        if (!err) {
                            var PokeList = doc;
                            res.render('userpokemons', {
                                data: data, avatar: avatar,
                                row: row + 1, indexRow: indexRow, full: full,
                                pokelist: PokeList
                            });
                        }
                    });
                    // res.render('userpokedex', { data: data, avatar: avatar, 
                    //     row: row + 1, indexRow: indexRow, full: full});
                    // res.send(indexRow)
                }
                else {
                    console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
                }
            });
        }
        else {
            console.log("Error in retriving Subject: " + JSON.stringify(err, undefined, 2));
        }
    });
});

app.get('/pokeshop', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var itemBall = require('./models/itemBalls');
    var itemToolbox = require('./models/itemToolboxes');
    var Finance = require('./models/finance');
    var Cart = require('./models/cart');
    var finance;
    Finance.findOne({ _id: parseInt(req.session.userid) }).exec(function (err, doc) {
        if (!err) {
            finance = doc;
            itemBall.aggregate([
                {
                    $lookup:
                    {
                        from: "pokeballs",
                        localField: "_id",
                        foreignField: "_id",
                        as: "Pokeballs"
                    }
                },
            ]).exec(function (err, doc) {
                if (!err) {
                    var Pokeballs = doc;
                    itemToolbox.aggregate([
                        {
                            $lookup:
                            {
                                from: "toolboxes",
                                localField: "_id",
                                foreignField: "_id",
                                as: "Toolboxes"
                            }
                        },
                    ]).exec(function (err, doc) {
                        if (!err) {
                            var Toolboxes = doc;
                            Cart.aggregate([
                                {
                                    $lookup:
                                    {
                                        from: "pokeballs",
                                        localField: "item_id",
                                        foreignField: "_id",
                                        as: "Pokeball"
                                    }
                                },
                                {
                                    $lookup:
                                    {
                                        from: "item_balls",
                                        localField: "item_id",
                                        foreignField: "_id",
                                        as: "InfoBall"
                                    }
                                },
                                {
                                    $match:
                                    {
                                        "account_id": parseInt(req.session.userid),
                                        "type": "ball"
                                    }
                                }
                            ]).exec(function (err, doc) {
                                if (!err) {
                                    var CartBalls = doc;
                                    Cart.aggregate([
                                        {
                                            $lookup:
                                            {
                                                from: "toolboxes",
                                                localField: "item_id",
                                                foreignField: "_id",
                                                as: "Toolbox"
                                            }
                                        },
                                        {
                                            $lookup:
                                            {
                                                from: "item_toolboxes",
                                                localField: "item_id",
                                                foreignField: "_id",
                                                as: "InfoTool"
                                            }
                                        },
                                        {
                                            $match:
                                            {
                                                "account_id": parseInt(req.session.userid),
                                                "type": "tool"
                                            }
                                        }
                                    ]).exec(function (err, doc) {
                                        if (!err) {
                                            var CartTools = doc;
                                            res.render('pokeshop', {
                                                Finance: finance,
                                                Pokeballs: Pokeballs,
                                                Toolboxes: Toolboxes,
                                                UserID: req.session.userid,
                                                CartBalls: CartBalls,
                                                CartTools: CartTools
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            console.log(err);
        }
    });
});

app.post('/code', function (req, res) {
    var price = req.body.price;
    var cash = req.body.cash;
    var coins = price.substring(0, price.length - 2);
    var CardGame = require('./models/cardgame');
    var Finance = require('./models/finance');
    CardGame.findOne({ cash: parseInt(price), status: 1 })
        .exec(function (err, doc) {
            if (!err) {
                // card = doc;
                res.send(doc);
            }
        });
});

app.post('/buycode', function (req, res) {
    var CardGame = require('./models/cardgame');
    var Finance = require('./models/finance');
    var MoneySellCode = require('./models/moneySellCode');
    var code = req.body.code;
    var cash = req.body.cash;
    var userid = req.body.userid;
    var currentcash = req.body.currentcash;
    var date = new Date();
    var selldate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    Finance.findOneAndUpdate({ _id: userid },
        {
            $set: {
                pokecoins: parseInt(currentcash)
            }
        }).exec(function (err, doc) {
            if (!err) {
                var moneysellcode = new MoneySellCode({
                    account_id: userid,
                    cash: parseInt(cash) * 100,
                    datetime: selldate
                });
                MoneySellCode.collection.insert(moneysellcode, function (err, doc) {
                    if (err) {
                        console.log(err);
                    }
                });

                CardGame.findOneAndUpdate({ _id: code },
                    {
                        $set: {
                            cash: cash,
                            status: 0
                        }
                    }).exec(function (err, doc) {
                        if (!err) {
                            res.send('done');
                        }
                    });
            }
        });
});

app.post('/getitem', function (req, res) {
    var id = req.body.id;
    var type = req.body.type;
    var userid = req.body.userid;
    var Pokeball = require('./models/pokeballs');
    var Toolboxes = require('./models/toolboxes');
    var Cart = require('./models/cart');

    if (type == "ball") {
        Pokeball.aggregate([
            {
                $lookup:
                {
                    from: "item_balls",
                    localField: "_id",
                    foreignField: "_id",
                    as: "InfoBall"
                }
            },
            {
                $match:
                {
                    "_id": parseInt(id)
                }
            }
        ]).exec(function (err, doc) {
            var data = doc;
            var cart = new Cart({
                account_id: parseInt(userid),
                item_id: parseInt(id),
                type: "ball"
            });
            Cart.collection.insertOne(cart, function (err, doc) {
                if (!err) {
                    res.send(data);
                }
            });
        });
    }

    else {
        Toolboxes.aggregate([
            {
                $lookup:
                {
                    from: "item_toolboxes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "InfoTool"
                }
            },
            {
                $match:
                {
                    "_id": parseInt(id)
                }
            }
        ]).exec(function (err, doc) {
            // res.send(doc);
            var data = doc;
            var cart = new Cart({
                account_id: parseInt(userid),
                item_id: parseInt(id),
                type: "tool"
            });
            Cart.collection.insertOne(cart, function (err, doc) {
                if (!err) {
                    res.send(data);
                }
            });
        });
    }
});

app.post('/removeitem', function (req, res) {
    var id = req.body.id;
    var type = req.body.type;
    var userid = req.body.userid;
    var Cart = require('./models/cart');

    if (type == "ball") {
        Cart.deleteOne({
            account_id: parseInt(userid),
            item_id: parseInt(id),
            type: type
        }).exec(function (err, doc) {
            if (!err) {
                res.send("done");
            }
        });
    }
    else {
        Cart.deleteOne({
            account_id: parseInt(userid),
            item_id: parseInt(id),
            type: type
        }).exec(function (err, doc) {
            if (!err) {
                res.send("done");
            }
        });
    }
});

app.post('/begintransaction', function (req, res) {
    var Transaction = require('./models/transactions');
    var userid = req.session.userid;
    var date = new Date();
    var buydate = date.getDate() + "-" + (date.getMonth() + 1) + "-" +
        date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" +
        date.getSeconds();
    Transaction.count(function (err, doc) {
        var trans_id = parseInt(doc) + 1;
        var transaction = new Transaction({
            _id: trans_id,
            account_id: parseInt(userid),
            datetime: buydate
        });
        Transaction.collection.insertOne(transaction, function (err, doc) {
            if (!err) {
                res.send(trans_id.toString());
            }
        });
    });
});

app.post('/buyitem', function (req, res) {
    var id = req.body.id;
    var type = req.body.type;
    var quantity = req.body.quantity;
    var price = parseInt(req.body.price);
    var name = req.body.name;
    var trans_id = req.body.trans_id;
    var userid = req.session.userid;
    var UserBall = require('./models/userballs');
    var UserToolbox = require('./models/usertoolboxes');
    var TransactionDetail = require('./models/transactiondetails');
    var Cart = require('./models/cart');

    if (type == 'ball') {
        UserBall.findOneAndUpdate({ account_id: parseInt(userid), ball_id: parseInt(id) },
            {
                $inc: { quantity: parseInt(quantity) }
            }, function (err, doc) {
                if (!err) {
                    Cart.deleteMany({ account_id: parseInt(userid) }).exec(function (err, doc) {
                    });

                    var trans_detail = new TransactionDetail({
                        transaction_id: parseInt(trans_id),
                        item_id: parseInt(id),
                        type: type,
                        name: name,
                        quantity: parseInt(quantity),
                        price: parseInt(price)
                    });
                    TransactionDetail.collection.insertOne(trans_detail, function (err, doc) {
                        if (!err) {
                            res.send('success');
                        }
                    });
                }
            });
    }
    else {
        UserToolbox.findOneAndUpdate({ account_id: parseInt(userid), toolbox_id: parseInt(id) },
            {
                $inc: { quantity: parseInt(quantity) }
            }, function (err, doc) {
                if (!err) {
                    Cart.deleteMany({ account_id: parseInt(userid) }).exec(function (err, doc) {
                    });

                    var trans_detail = new TransactionDetail({
                        transaction_id: parseInt(trans_id),
                        item_id: parseInt(id),
                        type: type,
                        name: name,
                        quantity: parseInt(quantity),
                        price: parseInt(price)
                    });
                    TransactionDetail.collection.insertOne(trans_detail, function (err, doc) {
                        if (!err) {
                            res.send('success');
                        }
                    });
                }
            });
    }
});

app.post('/updatePokecoins', function (req, res) {
    var remain = req.body.remain;
    var userid = req.session.userid;
    var Finance = require('./models/finance');
    Finance.findByIdAndUpdate({ _id: parseInt(userid) },
        {
            $set: {
                pokecoins: parseInt(remain)
            }
        }).exec(function (err, doc) {
            if (!err) {
                res.send("success");
            }
        });
});

app.post('/search', function (req, res) {
    var ItemBall = require('./models/itemBalls');
    var ItemTool = require('./models/itemToolboxes');
    var name = req.body.name;
    ItemBall.aggregate([
        {
            $lookup:
            {
                from: "pokeballs",
                localField: "_id",
                foreignField: "_id",
                as: "Pokeballs"
            }
        },
        { $match: { "Pokeballs.name": { $regex: ".*" + name + ".*" } } }
    ]).exec(function (err, doc) {
        if (!err) {
            var Ball = doc;
            ItemTool.aggregate([
                {
                    $lookup:
                    {
                        from: "toolboxes",
                        localField: "_id",
                        foreignField: "_id",
                        as: "Toolboxes"
                    }
                },
                { $match: { "Toolboxes.name": { $regex: ".*" + name + ".*" } } }
            ]).exec(function (err, doc) {
                if (!err) {
                    var Tool = doc;
                    res.send({ Ball: Ball, Tool: Tool })
                }
            });
        }
    });
});

app.get('/updateInfo', function (req, res) {
    if (req.session.userid == undefined) {
        return res.redirect('/');
    }

    var User = require('./models/users');
    User.aggregate([
        {
            $lookup:
            {
                from: "accounts",
                localField: "account_id",
                foreignField: "_id",
                as: "Account"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        res.render('updateInfo', { data: doc, session: req.session.userid });
    });
});

app.post('/updateInfo', function (req, res) {
    var Account = require('./models/accounts');
    var User = require('./models/users');

    Account.findOne({ _id: parseInt(req.session.userid) }).exec(function (err, doc) {
        var account = doc;
        if (doc.nickname != req.body.nickname) {
            Account.findOne({ nickname: req.body.nickname }).exec(function (err, doc) {
                if (doc != null) {
                    res.end("Nickname");
                }
                else {
                    account.nickname = req.body.nickname;
                    Account.collection.save(account, function (err, doc) { });
                    User.findOne({ account_id: parseInt(req.session.userid) }).exec(function (err, doc) {
                        var user = doc;
                        if (doc.email != req.body.email) {
                            User.findOne({ email: req.body.email }).exec(function (err, doc) {
                                if (doc != null) {
                                    res.end("Email");
                                }
                                else {
                                    user.email = req.body.email;
                                    user.fullname = req.body.fullname;
                                    user.age = parseInt(req.body.age);
                                    User.collection.save(user, function (err, doc) { });
                                    res.end("Success");
                                }
                            });
                        }
                        else {
                            user.fullname = req.body.fullname;
                            user.age = parseInt(req.body.age);
                            User.collection.save(user, function (err, doc) { });
                            res.end("Success");
                        }
                    });
                }
            });
        }
        else {
            User.findOne({ account_id: parseInt(req.session.userid) }).exec(function (err, doc) {
                var user = doc;
                if (doc.email != req.body.email) {
                    User.findOne({ email: req.body.email }).exec(function (err, doc) {
                        if (doc != null) {
                            res.end("Email");
                        }
                        else {
                            user.email = req.body.email;
                            user.fullname = req.body.fullname;
                            user.age = parseInt(req.body.age);
                            User.collection.save(user, function (err, doc) { });
                            res.end("Success");
                        }
                    });
                }
                else {
                    user.fullname = req.body.fullname;
                    user.age = parseInt(req.body.age);
                    User.collection.save(user, function (err, doc) { });
                    res.end("Success");
                }
            });
        }
    });
});

app.get('/manageAccount', function (req, res) {
    var Account = require('./models/accounts');
    Account.aggregate([
        {
            $lookup:
            {
                from: "levelaccounts",
                localField: "_id",
                foreignField: "_id",
                as: "Level"
            }
        },
        {
            $lookup:
            {
                from: "avatars",
                localField: "_id",
                foreignField: "account_id",
                as: "Avatar"
            }
        },
        {
            $lookup:
            {
                from: "characters",
                localField: "characters._id",
                foreignField: "Avatar.character_id",
                as: "Character"
            }
        }
    ]).exec(function (err, doc) {
        res.render("manageAccount", { data: doc });
    })
});

app.post('/updateAccount', function (req, res) {
    var Account = require('./models/accounts');
    console.log(req.body.nickname);
    console.log(req.body.status);
    Account.findOne({ nickname: req.body.nickname }).exec(function (err, doc) {
        var account = doc;
        account.status = parseInt(req.body.status);
        Account.collection.save(account, function (err, doc) {
            if (!err) {
                res.send("Success");
            }
        })
    });
});

app.get('/history', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }

    var Transaction = require('./models/transactions');
    Transaction.aggregate([
        {
            $lookup:
            {
                from: "transactiondetails",
                localField: "_id",
                foreignField: "transaction_id",
                as: "Detail"
            }
        },
        {
            $match:
            {
                "account_id": parseInt(req.session.userid)
            }
        }
    ]).exec(function (err, doc) {
        res.render('history', { data: doc });
    });
});

app.get('/changePassword', function (req, res) {
    if (req.session.userid == undefined) {
        res.redirect('/');
    }
    else {
        res.render('changePassword');
    }
})

app.post('/changePassword', function (req, res) {
    var oldpass = req.body.oldpass;
    var newpass = req.body.newpass;
    var Account = require('./models/accounts');
    Account.findOne({ _id: parseInt(req.session.userid) }).exec(function (err, doc) {
        if (doc != null) {
            var account = doc;
            var hashOldpass = md5(account.username + oldpass);
            if (account.password == hashOldpass) {
                account.password = md5(account.username + newpass);
                Account.collection.save(account, function (err, doc) {
                    if (!err) {
                        res.send("Success");
                    }
                });
            }
            else {
                res.end("Wrong password");
            }
        }
    });
});

app.post('/forgot', function (req, res) {
    var email = req.body.email;
    var newpass = Math.random().toString(36).slice(-8);;
    var User = require('./models/users');
    var Account = require('./models/accounts');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pokemon.ute19.06@gmail.com',
            pass: 'Pokemon@123'
        }
    });

    User.findOne({ email: email }).exec(function (err, doc) {
        if (doc != null) {
            Account.findOne({ _id: parseInt(doc.account_id) }).exec(function (err, doc) {
                if (!err) {
                    var account = doc;
                    account.password = md5(account.username + newpass);
                    var hashpass = md5(account.username + newpass);
                    Account.collection.save(account, function (err, doc) {
                        if (!err) {
                            var mailOptions = {
                                from: 'pokemon.ute19.06@gmail.com',
                                to: email,
                                subject: 'Get new password',
                                text: 'Your new password is: ' + newpass
                            };
                            transporter.sendMail(mailOptions, function (error, doc) {
                                if (error) {
                                    res.end(error);
                                } else {
                                    res.end("Success");
                                }
                            });
                        }
                    })
                }
            });
        }
        else {
            res.end("Wrong Email");
        }
    });
});

app.get('/manageItems', function (req, res) {
    var Toolboxes = require('./models/toolboxes');
    var Balls = require('./models/pokeballs');

    Balls.find().exec(function (err, doc) {
        if (!err) {
            var balls = doc;
            Toolboxes.find().exec(function (err, doc) {
                if (!err) {
                    var tools = doc;
                    res.render('manageItem', { Balls: balls, Tools: tools });
                }
            });
        }
    })
});

app.post('/getItem', function (req, res) {
    var id = req.body.id;
    var type = req.body.type;
    var Balls = require('./models/pokeballs');
    var Tools = require('./models/toolboxes');

    if (type == ball) {
        Balls.aggregate([
            {
                $lookup:
                {
                    from: "item_balls",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Item"
                }
            },
            {
                $match:
                {
                    "_id": parseInt(id)
                }
            }
        ]).exec(function (err, doc) {
            if (!err) {
                res.end(doc[0]);
            }
        });
    }
    else {
        Tools.aggregate([
            {
                $lookup:
                {
                    from: "item_toolboxes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "Item"
                }
            },
            {
                $match:
                {
                    "_id": parseInt(id)
                }
            }
        ]).exec(function (err, doc) {
            if (!err) {
                res.end(doc[0]);
            }
        });
    }
});

app.post('/editBall', uploadBall , function (req, res) {
    var editBall = req.body;
    var Ball = require('./models/pokeballs');
    var ItemBalls = require('./models/itemBalls');
    Ball.findOne({_id: parseInt(req.body.id)}).exec(function(err, doc){
        var ball = doc;
        ball.name = editBall.name;
        ball.description = editBall.description;
        Ball.collection.save(ball, function(err, doc){
            if(!err){
                ItemBalls.findOne({_id: parseInt(editBall.id)}).exec(function(err, doc){
                    var itemball = doc;
                    itemball.price = parseInt(editBall.price);
                    ItemBalls.collection.save(itemball, function(err, doc){});
                });
            }
        });
    })
    uploadBall(req, res, (err) => {
        if(!err){
            res.end("success");
        }
        else{
            res.end(err);
        }
    });
});

app.post('/editTool', uploadTool , function (req, res) {
    var editTool = req.body;
    var Tools = require('./models/toolboxes');
    var ItemTools = require('./models/itemToolboxes');
    Tools.findOne({_id: parseInt(editTool.id)}).exec(function(err, doc){
        if(!err){
            var tool = doc;
            tool.name = editTool.name;
            tool.description = editTool.description;
            Tools.collection.save(tool, function(err, doc){
                if(!err){
                    ItemTools.findOne({_id: parseInt(editTool.id)}).exec(function(err, doc){
                        var itemtool = doc;
                        itemtool.price = parseInt(editTool.price);
                        ItemTools.collection.save(itemtool, function(err, doc){});
                    })
                }
            })
        }
    })
    uploadBall(req, res, (err) => {
        if(!err){
            res.end("success");
        }
        else{
            res.end(err);
        }
    })
});

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']

    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}

app.get('/admin', function(req, res){
    res.render('loginAdmin');
});

app.post('/admin', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    if(username == "pokeadminute" && password == "20345678"){
        res.render('admin');
    }
    else{
        res.render('loginAdmin', {msg: "Login fail!"});
    }
})

io.sockets.on('connection', function(socket, username){

    socket.on('new_user', function(username){
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_user', username);
    });
    
    socket.on('message', function(message){
        message = ent.encode(message);
        socket.broadcast.emit('message', {username : socket.username, message: message});
        var text = {name: socket.username, text: message}
        chatbox.push(text);
    });
});

app.post('/chat', function(req, res){
    var username = req.body.username;
    var message = req.body.message;
    var text = {name: username, text: message}
    req.session.chatbox.push(text);
    res.end("success");
})