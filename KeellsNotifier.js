let AWS = require('aws-sdk');
const sns = new AWS.SNS();
const axios = require('axios');
const city = "Colombo";

exports.handler = async (event) => {

    let response = await axios.get('https://int.keellssuper.net/login');
    if (response.data) {
        let htmlText = JSON.stringify(response.data);
        console.log(htmlText);
        if (htmlText.includes(city)) {
            console.log("Ready!");
            try {
                let data = await sns.publish({
                    Message: `Keells is now available for city : ${city}`,
                    PhoneNumber: process.PHONE_NUMBER,
                    MessageAttributes: {
                        'AWS.SNS.SMS.SMSType': {
                            DataType: "String",
                            StringValue: "Transactional"
                        },
                        'AWS.SNS.SMS.SenderID': {
                            DataType: "String",
                            StringValue: "Keels Notifier"
                        }
                    }
                }).promise();

            } catch (err) {
                console.log("Error : " + JSON.stringify(err));
            };
        } else {
            console.log("Not ready");
        }
    }

    return { "message": "Successfully executed" };
};