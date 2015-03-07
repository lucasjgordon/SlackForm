# slackform by lucasjgordon
slackform.js is a Parse Cloud Code module that will allow you to automatically invite new Typeform submissions to your Slack community.

Created by [lucasjgordon](http://www.lucasjgordon.com)

## Requirement
This module is designed to be run on [Parse Cloud Code](https://parse.com/). If you haven't used Parse before, they offer an awesome BaaS service to help you get your apps up and running quickly across all platforms.

## Basic Usage
Add slackform.js to your cloud/ directory. Then in main.js, include the module using:

````javascript
var slackform = require('cloud/slackform.js');
````

Now you need to get your keys. You'll need you [Typeform API Key](https://admin.typeform.com/account), and the name of your Slack group. Create a new Slack token [here](https://api.slack.com/web). You'll need your Typeform ID, which can be obtained from the URL of the actual form - it will look something like this "bU6FKI".

Finally, you need to know the name of the email field in the Typeform JSON response. Create a URL like this:

https://api.typeform.com/v0/form/TYPEFORM_ID?key=TYPEFORM_API_KEY&completed=true&limit=1

Load it up, and in the questions array find the form entry that asks for the user's email address. You need the id of the email field, it should look something like this "email_4202153".

Initialise slackform.js like this:

````javascript
slackform.initialise({
	typeformApiKey: '<TYPEFORM_API_KEY>',
	typeformId: '<TYPEFORM_ID>',
	typeformEmail: '<TYPEFORM_EMAIL_ID>',
	slackChannel: '<SLACK_GROUP_NAME>',
	slackToken: '<SLACK_TOKEN>'
});
````

## Public Methods

###Get Typeform Results
This method returns the Typeform submissions within the last hour.

````javascript
slackform.getTypeFormResults().then(function (data) {});
````

This method returns data.results as an array of entries, or data.error.

###Invite User
This method invites a user to your Slack group.

````javascript
slackform.inviteUser(typeformEntry.answers).then(function (data) {});
````

This method returns data.success or data.error.

##Example

Add the following code to your main.js file, and set up a Cloud job to run every hour.

````javascript
var slackform = require('cloud/slackform.js');

slackform.initialise({
	typeformApiKey: '<TYPEFORM_API_KEY>',
	typeformId: '<TYPEFORM_ID>',
	typeformEmail: '<TYPEFORM_EMAIL_ID>',
	slackChannel: '<SLACK_GROUP_NAME>',
	slackToken: '<SLACK_TOKEN>'
});

Parse.Cloud.job("inviteUsers", function (request, status) {
	slackform.getTypeFormResults().then(function (data) {
		if (data && !data.error && data.results && data.results.length > 0) {
			var promises = [];
			for (var i = 0; i < data.results.length; i++) {
				promises.push(slackform.inviteUser(data.results[i].answers));
			}
			Parse.Promise.when(promises).then(function () {
				var userCount = 0;
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] && !arguments[i].error && arguments[i].success) {
						userCount++;
					}
				}
				if (userCount > 0) {
					status.success(userCount + ' new users invited');
				} else {
					status.success('No new users invited');
				}
			});
		} else {
			if (data.error) {
				status.error(data.error);
			} else {
				status.success('No new typeform results');	
			}
		}
	});
});
````