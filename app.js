// Channel access token
const accessToken = "icZP1tn+eqmEidcLkTBDCfXs5OOrVagDXrat7DFXepTn4hUjgma6NuUlgzWO4ORa2gd+Vqf7DeZ11DuljJIgxxGQMr1XGbgVdki/dLDa8uSGvppEWPwmfuMktxeMBmeOwiJfSc2s00iK2WHbC61k0wdB04t89/1O/w1cDnyilFU="
const secretToken =  "6b35c6553b33d9093fb89d77610613c6"


// Import Library
const express = require('express');
const line = require('@line/bot-sdk');
const https = require('https');

require('dotenv').config();

const app = express();

const config = {
    channelAccessToken: accessToken, // Key to call messaging api เรียก
    channelSecret: secretToken       // Key to access line channel
};

const client = new line.Client(config);

// รับพารามิเตอร์ 3 ตัว /webhook ที่อยู่ส่วนสุดท้ายของ url
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

// var data = "ping-pong";

app.get('/ping', function (req,res){
    console.log(`1 ping-pong`);
    res.send('ping-pong');
});

function handleEvent(event) {

    console.log(event);
    if (event.type === 'message' && event.message.type === 'text') {
        handleMessageEvent(event);
    } else {
        return Promise.resolve(null);
    }
}

function handleMessageEvent(event) {
    
    var eventText = event.message.text.toLowerCase();
    
    var trimed = eventText.trim();

    if(trimed === 'nbot'){
        var msg = {
            type: 'text',
            text: 'Try type "nbot nserve" or "nbot hi"'
        }; 
    }
    else{
        var splited = trimed.split(" ");
        console.log(splited);
        if(splited[0] === 'nbot'){

            if(splited[1] === 'hi'){
                var msg = {
                    type: 'text',
                    text: 'Hi !'
                };
            }
            else if(splited[1] === ''){
                if(splited[2] === 'hi'){
                    var msg = {
                        type: 'text',
                        text: 'Hi !'
                    };
                }
            }
            else if(splited[1] === 'nserve'){

                // let data = '';

                https.get('https://nbot-nserve.herokuapp.com/ping', (resp) => {

                    // print 'ping-pong' from GET /ping line 33
                    
                    let data = '';

                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        // console.log(chunk); // Hex 'ping-pong'
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        console.log(`2 ${data}`) // print 'ping-pong' from data+chunk
                        // console.log(JSON.parse(data));
                        if(data === 'ping-pong'){
                            console.log('Yes');
                        }
                        else{
                            console.log('No');
                        }
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
                    
                console.log(`3 ${data}`) // print '' from line 80

                if(data === 'ping-pong'){
                    var msg = {
                        type: 'text',
                        text: 'ping-pong'
                    };
                }
                else{
                    var msg = {
                        type: 'text',
                        text: 'cannot connect to server'
                    };
                }

            }
            else if(splited[1] === 'ออกไป'){
                // console.log(event.source)
                console.log(event.source.groupId)
                client.leaveGroup(event.source.groupId)
                .then(() => {
                    // return status 200 and empty json 
                    res.status(200).json({});
                })
                .catch((err) => {
                    // error handling
                    console.log(err)
                });
            }
            else{
                var msg = {
                    type: 'text',
                    text: 'Try type "nbot nserve" or "nbot hi"'
                }; 
            }
        }
    }

    return client.replyMessage(event.replyToken, msg);
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});