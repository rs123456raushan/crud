const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost/employee';

const connectMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    })
}

module.exports = connectMongo;