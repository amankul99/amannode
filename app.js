// upload a video on google drive with node js 
const fs = require('fs');
const { google }= require('googleapis');

const apikeys = require('./apikey.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];

// A Function that can provide access to google drive api
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient){
    console.log("upload starting")
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 

        var fileMetaData = {
            name:'./videos/video.mp4',    
            parents:['18-z5bYo3p0u5c6s7nj4w4Dyi5duB5krB'] // A folder ID to which file will get uploaded
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream('./videos/video.mp4'), // files that will get uploaded
                mimeType:'video/mp4'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            } 
            console.log("uploaded ")
            resolve(file);
        })
    });
}

authorize().then(uploadFile).catch("error",console.error()); // function call