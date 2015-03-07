var typeformApiKey;
var typeformId;
var typeformEmail;
var slackChannel;
var slackToken;

module.exports = {
	getTypeFormResults: function () {
		var promise = new Parse.Promise();
		if (!typeformId || !typeformApiKey) {
			promise.resolve({
				error: 'Need to initialise.'
			});
		} else {
			var hour = 60 * 60 * 1;
			var hourAgo = Math.floor(Date.now() / 1000) - hour;
			Parse.Cloud.httpRequest({
				url: 'https://api.typeform.com/v0/form/' + typeformId + '?key=' + typeformApiKey + '&completed=true&since=' + hourAgo,
				success: function (httpResponse) {
					if (httpResponse && httpResponse.data && httpResponse.data.responses && httpResponse.data.responses.length > 0) {
						promise.resolve({
							results: httpResponse.data.responses
						});
					} else {
						promise.resolve({
							error: 'No results.'
						});
					}
				},
				error: function (error) {
					promise.resolve({
						error: error
					});
				}
			});
		}
		return promise;
	},
	initialise: function (data) {
		typeformApiKey = data.typeformApiKey;
		typeformId = data.typeformId;
		typeformEmail = data.typeformEmail;
		slackChannel = data.slackChannel;
		slackToken = data.slackToken;
	},
	inviteUser: function (user) {
		var promise = new Parse.Promise();
		Parse.Cloud.httpRequest({
			method: 'POST',
				url: 'https://' + slackChannel + '.slack.com/api/users.admin.invite?t=1416723927',
			body: {
				email: user[typeformEmail],
				token: slackToken,
				set_active: true,
				_attempts: 1
			},
			success: function (httpResponse) {
				if (httpResponse && httpResponse.data && !httpResponse.data.error && httpResponse.data.ok) {
					promise.resolve({
						success: true
					});
				} else {
					promise.resolve({
						error: 'Could not invite user'
					});
				}
			},
			error: function (error) {
				promise.resolve({
					error: error
				});
			}
		});
		return promise;
	}
};