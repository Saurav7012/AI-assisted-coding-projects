const axios = require('axios');


async function waiting(){
    setTimeout(()=>{
        return 1;
    },1000);
}

function getLanguageID(language){
    if(language==="C++")
    return 54;

    if(language==="Java")
    return 62;

    if(language==="JavaScript")
    return 63;
}

async function submitBatch(submissionArray){

    const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        base64_encoded: 'false'
    },
    headers: {
        'x-rapidapi-key': 'a4effa337emsh468460035e7d061p10abbajsn769426b31d56',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        submissions: submissionArray
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const data = await fetchData();
    return data;
}

function tokensToString(arr) {
    return arr.map(obj => obj.token).join(",");
}

async function submitTokens(tokenString){

    const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
        tokens: tokenString,
        base64_encoded: 'false',
        fields: '*'
    },
    headers: {
        'x-rapidapi-key': 'a4effa337emsh468460035e7d061p10abbajsn769426b31d56',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error.message);
        }
    }

    while(true){
        const data = await fetchData();
        const finishedRunning = data.submissions.every((result)=>{
            return result.status_id>=3;
        })
        
        if(finishedRunning){
            return data.submissions;
        }

        await waiting();
    }


}

module.exports = {
    getLanguageID,
    submitBatch,
    tokensToString,
    submitTokens
}