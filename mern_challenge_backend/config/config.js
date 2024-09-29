const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');     // Joi for data blueprints and data validations

dotenv.config({ path: path.join(__dirname, '../.env') });

// joi ScHema
const envVarSchema = Joi.object()
    .keys({
        DB_ATLAS_URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
        THIRD_PARTY_URL: Joi.string().default("https://s3.amazonaws.com/roxiler.com/product_transaction.json"),
    })
    .unknown();

const { value: envVars, error } = envVarSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}


module.exports = {
    mongoose: {
        mongo_url: envVars.DB_ATLAS_URL,
        mongo_pass: envVars.DB_PASS,
        // options: {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // }
    },
    port: envVars.PORT,
    apiSeedData: envVars.THIRD_PARTY_URL,
}