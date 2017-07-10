const request = require("request-promise-native");

// Definitions for API endpoints
const Endpoints = {
	ACTIVITY: "https://activity.api.np.km.playstation.net/activity/api/v1/users/",
	OAUTH: "https://auth.api.sonyentertainmentnetwork.com/2.0/oauth/token",
	SSO: "https://auth.api.sonyentertainmentnetwork.com/2.0/ssocookie",
	CODE: "https://auth.api.sonyentertainmentnetwork.com/2.0/oauth/authorize",
	USERS: "https://us-prof.np.community.playstation.net/userProfile/v1/users/",
	MESSAGE: "https://us-gmsg.np.community.playstation.net/groupMessaging/v1/messageGroups",
	MESSAGE_THREADS: "https://us-gmsg.np.community.playstation.net/groupMessaging/v1/threads",
	MESSAGE_USERS: "https://us-gmsg.np.community.playstation.net/groupMessaging/v1/users/",
	TROPHY: "https://us-tpy.np.community.playstation.net/trophy/v1/",
	COMMUNITIES: "https://communities.api.playstation.com/v1/communities/"
}

class Utils {
	const HTTP_UNAUTHORIZED = 401;
	const HTTP_OK = 200;
	const HTTP_NOT_FOUND = 404;
	// Function to return cURL headers in an array
	get_headers_from_curl_response($headerContent) {
		$headers = array();
		$arrRequests = explode("\r\n\r\n", $headerContent);

		for ($index = 0; $index < count($arrRequests) -1; $index++) {
			foreach (explode("\r\n", $arrRequests[$index]) as $i => $line) {
				if ($i === 0) {
					$headers[$index]['http_code'] = $line;
				} else {
					list($key, $value) = explode(': ', $line);
					$headers[$index][$key] = $value;
				}
			}
		}
		return $headers;
	}

	get_response_code($responseHeader) {
		$http_code = explode(" ", $responseHeader[0]["http_code"]);
		return $http_code[1];
	}

	// Sends a request (either POST or GET)
	// Returns an array of the response
	// ['body'] => response body
	// ['headers'] => response headers
	sendRequest(url, headers = null, outputHeader = false, cookie = null, requestMethod = "GET", requestArgs = null) {
		let final = {};
		let options = {
			url: `${url}?${requestArgs}`,
			method: requestMethod,
			headers: {
				"User-Agent": "PSN-JS/0.1"
			}
		};

		// if ($Cookie != null)
		// 	curl_setopt($ch, CURLOPT_COOKIE, "npsso=" . $Cookie);

		// if ($Headers != null)
		// 	curl_setopt($ch, CURLOPT_HTTPHEADER, $Headers);

		request(options, callback).then(response => {
			if (response.statusCode !== 200) return;
			final.body = response.headers;
			if (outputHeader === true) final.headers = response.headers;
			return final;
		})
		.catch((err) => {
			throw err;
		});

	}
}

modules.export = Utils;