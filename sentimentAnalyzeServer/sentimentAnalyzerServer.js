const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config()

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
            version: '2020-08-01',
            authenticator: new IamAuthenticator({
                apikey: api_key,
            }),
        serviceUrl: api_url,
    });

    return naturalLanguageUnderstanding;
}



app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    //res.render('index.html');
    res.send("Success");
  });

app.get("/url/emotion", (req,res) => {
    const querytext = req.query.url
    const newinstance = getNLUInstance();
    const analyzeparams = {
        'url': querytext,
        'features': {
            'entities' : {
                'emotion' : true,
                'sentiment': false
            }, 'keywords': {
                'emotion': true,
                'sentiment': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            const emotionalanalysis = analysisresults.result.keywords[0].emotion;
            return res.send(emotionalanalysis);
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/url/sentiment", (req,res) => {
    const querytext = req.query.url
    const newinstance = getNLUInstance();
    const analyzeparams = {
        'url': querytext,
        'features': {
            'entities' : {
                'sentiment' : true,
                'emotion'  : false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            const sentimentresponse = analysisresults.result.keywords[0].sentiment.label;
            return res.send(sentimentresponse);
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/text/emotion", (req,res) => {
    const querytext = req.query.text
    const newinstance = getNLUInstance();
    const analyzeparams = {
        'text': querytext,
        'features': {
            'entities' : {
                'emotion' : true,
                'sentiment': false
            }, 'keywords': {
                'emotion': true,
                'sentiment': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            const emotionalanalysis = analysisresults.result.keywords[0].emotion;
            console.log(emotionalanalysis);
            return res.send(emotionalanalysis);
        }).catch( err =>
            {
                console.log(err)
            })
});

app.get("/text/sentiment", (req,res) => {
    const querytext = req.query.text
    const newinstance = getNLUInstance();
    const analyzeparams = {
        'text': querytext,
        'features': {
            'entities' : {
                'sentiment' : true,
                'emotion'  : false
            }, 'keywords': {
                'sentiment': true,
                'emotion': false

            }
        } 
    }

    newinstance.analyze(analyzeparams).then(analysisresults =>
        {
            const sentimentresponse = analysisresults.result.keywords[0].sentiment.label;
            return res.send(sentimentresponse);
        }).catch( err =>
            {
                console.log(err)
            })
});


let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

