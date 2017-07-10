const querystring = require('querystring'),
	  Utils = require("/class/Utils");

class Auth {
	constructor(email, password, ticket = null, code = null) {
		let oauth,
			last_error,
			npsso,
			grant_code,
			refresh_token;

		// POST data for the initial request (for the NPSSO Id)
		let loginRequest = {
			authentication_type: "password",
			username: null,
			password: null,
			client_id: "71a7beb8-f21a-47d9-a604-2e71bee24fe0"
		}
		// POST data for the oauth token
		let OAuthRequest = {
			app_context: "inapp_ios",
			client_id: "b7cbf451-6bb6-4a5a-8913-71e61f462787",
			client_secret: "zsISsjmCx85zgCJg",
			code: null,
			duid: "0000000d000400808F4B3AA3301B4945B2E3636E38C0DDFC",
			grant_type: "authorization_code",
			scope: "capone:report_submission,psn:sceapp,user:account.get,user:account.settings.privacy.get,user:account.settings.privacy.update,user:account.realName.get,user:account.realName.update,kamaji:get_account_hash,kamaji:ugc:distributor,oauth:manage_device_usercodes"
		}
		// GET data for the X-NP-GRANT-CODE
		let codeRequest = {
			state: "06d7AuZpOmJAwYYOWmVU63OMY",
			duid: "0000000d000400808F4B3AA3301B4945B2E3636E38C0DDFC",
			app_context: "inapp_ios",
			client_id: "b7cbf451-6bb6-4a5a-8913-71e61f462787",
			scope: "capone:report_submission,psn:sceapp,user:account.get,user:account.settings.privacy.get,user:account.settings.privacy.update,user:account.realName.get,user:account.realName.update,kamaji:get_account_hash,kamaji:ugc:distributor,oauth:manage_device_usercodes",
			response_type: "code"
		}
		// POST data for the refresh oauth token (allows user to stay signed in without entering info again (assuming you've kept the refresh token))
		let refreshOAuthRequest = {
			app_context: "inapp_ios",
			client_id: "b7cbf451-6bb6-4a5a-8913-71e61f462787",
			client_secret: "zsISsjmCx85zgCJg",
			refresh_token: null,
			duid: "0000000d000400808F4B3AA3301B4945B2E3636E38C0DDFC",
			grant_type: "refresh_token",
			scope: "capone:report_submission,psn:sceapp,user:account.get,user:account.settings.privacy.get,user:account.settings.privacy.update,user:account.realName.get,user:account.realName.update,kamaji:get_account_hash,kamaji:ugc:distributor,oauth:manage_device_usercodes"
		}
		// POST data for the 2FA request (for the NPSSO id)
		let twoFactorAuthRequest = {
			authentication_type: "two_step",
			ticket_uuid: null,
			code: null,
			client_id: "b7cbf451-6bb6-4a5a-8913-71e61f462787"
		}

		// store login data
		this.loginRequest.username = email;
		this.loginRequest.password = password;
		this.twoFactorAuthRequest.ticket_uuid = ticket;
		this.twoFactorAuthRequest.code = code;

		// Throw an AuthException if any form of authentication has failed
		if (!this.grabNPSSO() || !this.grabCode() || !this.grabOAuth()) {
			throw new AuthException(this.last_error);
		}
	}

	// Fetches the last error caught by the class
	getLastError() {
		return this.last_error;
	}

	// Grabs X-NP-GRANT-CODE
	grabCode() {
		let response = Utils.sendRequest(Utils.Endpoints.CODE, null, true, this.npsso, "GET", querystring.stringify(this.codeRequest));
		let httpCode = Utils.getResponseCode(response.headers);

		// Needs custom error handling due to the type of response (or lack thereof)
		// HTTP code that will be given due to too many requests from a single IP
		if (httpCode === 503) {
			let error = {
				error: "service_unavailable",
				errorDescription: "Service unavailable. Possible IP block.",
				errorCode: 20
			}
			this.last_error = JSON.stringify(error);
			return false;
		}
		// if the grant code does not exist in the response header
		if (!response.header[0]["X-NP-GRANT-CODE"]) {
			let error = {
				error: "invalid_np_grant",
				errorDescription: "Failed to obtain X-NP-GRANT-CODE",
				errorCode: 20
			}
			this.last_error = JSON.stringify(error);
			return false;
		}

		this.grant_code = response.headers[0]["X-NP-GRANT-CODE"];
		return true;
	}

	// Grabs an OAuth Token
	grabOAuth() {
		this.OAuthRequest.code = this.grant_code;
		let response = Utils.sendRequest(Utils.Endpoints.OAUTH, null, false, null, "POST", querystring.stringify(this.OAuthRequest));
		let data = JSON.parse(response.body, false);

		if (data.error) {
			this.last_error = response.body;
			return false;
		}

		this.oath = data.access_token;
		this.refresh_token = data.refresh_token;
		return true;
	}

	// This function will generate new tokens without requiring the user to login again, so long as you kept their refresh token.
	// We want this to be a static function so you can use it without creating a new instance of Auth just for new tokens.
	// Returns FALSE on error
	// Otherwise the new tokens will be returned as an array, just like getTokens().
	grabNewTokens(refreshToken) {
		this.refreshOAuthRequest = requestToken;
		let response = Utils.sendRequest(Utils.Endpoints.OAUTH, null, false, null, "POST", querystring.stringify(this.refreshOAuthRequest));
		let data = JSON.parse(response.body);
		if (data.error) return false;
		return {
			oauth: data.access_token,
			refresh: data.refresh_token
		}
	}

	// Grabs the NPSSO ID
	grabNPSSO() {
		let response;
		if (this.twoFactorAuthRequest.ticket_uuid && this.twoFactorAuthRequest.code) {
			response = Utils.sendRequest(Utils.Endpoints.SSO, null, false, false, "POST", querystring.stringify(this.twoFactorAuthRequest));
		} else {
			response = Utils.sendRequest(Utils.Endpoints.SSO, null, false, false, "POST", querystring.stringify(this.loginRequest));
		}
		let data = JSON.parse(response.body);
		if (data.error) {
			this.last_error = response.body;
			return false;
		}
		if (data.ticket_uuid) {
			let error = {
				error: "2fa_code_required",
				errorDescription: "2FA Code Required",
				ticket: data.ticket_uuid
			}
			this.last_error = JSON.stringify(error);
			return false;
		}
		this.npsso = data.npsso;
		return true;
	}

	// Returns the current OAuth tokens (required for other classes)
	// oauth => used for requests to the API
	// refresh => used for generating a new oauth token without logging in each time
	// npsso => required for the Communities class
	getTokens() {
		return {
			oauth: this.oauth,
			refresh: this.refresh_token,
			npsso: this.npsso
		}
	}
}

module.exports = Auth;