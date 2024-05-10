window.onload = function() {
    refreshLinks();
};

document.getElementById('refresh').addEventListener('click', refreshLinks);
document.getElementById('submit').addEventListener('click', submitUrl);

function submitUrl() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        alert('Please enter a SoundCloud URL.');
        return;
    }

    // Configure the AWS region and credentials
    AWS.config.update({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const lambda = new AWS.Lambda();

    const params = {
        FunctionName: 'myLamKar', // replace with the name of your Lambda function
        InvocationType: 'Event', // for asynchronous invocation
        Payload: JSON.stringify({
            url: url // use the URL from the input field
        })
    };

    lambda.invoke(params, function(error, data) {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Function invoked successfully:', data);
            document.getElementById('popup').style.display = 'block'; // show the popup message
        }
    });
}

function refreshLinks() {
    // Configure the AWS region and credentials
    AWS.config.update({
        region: process.env.AWS_REGION, // replace with your preferred region
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // replace with your access key ID
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // replace with your secret access key
    });

    const lambda = new AWS.Lambda();

    const params = {
        FunctionName: 'helloWorld', // replace with the name of your third Lambda function
        InvocationType: 'RequestResponse' // for synchronous invocation
    };

    lambda.invoke(params, function(error, data) {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Function invoked successfully:', data);
            const payload = JSON.parse(data.Payload);
            const body = JSON.parse(payload.body);
            const playlistLinks = body.playlistLinks;
            console.log('Received playlist links:');
            playlistLinks.forEach(function(link, index) {
                console.log((index + 1) + '. ' + link);
            });

            const table = document.getElementById('linksTable');
            // Clear the table
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            // Add new rows
            playlistLinks.forEach(function(link) {
                const row = table.insertRow(-1);
                const cell = row.insertCell(0);
                cell.textContent = link;
            });
        }
    });
}
