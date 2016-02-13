# SlackForm by lucasjgordon
SlackForm is a node module that will allow you to automatically invite new Typeform submissions to your Slack community.

## Basic Usage
Add SlackForm.js to your project, run npm install. Include the module using:

````javascript
var SlackForm = require('./SlackForm.js');
````

Now you need to get your keys. You'll need you [Typeform API Key](https://admin.typeform.com/account) and the name of your Slack group as it is shown in the group's url. Create a new Slack token [here](https://api.slack.com/web). You'll need your Typeform ID, which can be obtained from the URL of the actual form - it will look something like this "bU6FKI".

Finally, you need to know the name of the email field in the Typeform JSON response. Create a URL like this:

https://api.typeform.com/v0/form/TYPEFORM_ID?key=TYPEFORM_API_KEY&completed=true&limit=1

Load it, and in the questions array find the form entry that asks for the user's email address. You need the id of the email field, it should look something like this "email_4202153".

Initialise SlackForm like this:

````javascript
var slackForm = new SlackForm({
	typeformApiKey: '<TYPEFORM_API_KEY>',
	typeformId: '<TYPEFORM_ID>',
	typeformEmail: '<TYPEFORM_EMAIL_ID>',
	slackChannel: '<SLACK_GROUP_NAME>',
	slackToken: '<SLACK_TOKEN>'
});
````

## Public Methods

###Invite
This method sends invites to all email addresses from Typeform submissions within the last hour. It returns an array of responses from each invite request. Set up a cron job to run the script every hour.

````javascript
slackForm.invite(function (err, data) {
	if (err) {
		throw err;
	}

	console.log(data);
});
````