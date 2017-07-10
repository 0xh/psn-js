const Utils = require("/class/Utils"),
	  User = require("/class/User");

class Friend {
	construct(tokens) {
		this.oauth = tokens.oauth;
		this.refresh_token = tokens.refresh;
	}

	// Grabs the logged in user's friends, with a status filter and the amount of users to return.
	myFriends(filter = 'online', limit = 36) {
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(`${Endpoints.USERS}me/friends/profiles2?fields=onlineId,avatarUrls,following,friendRelation,isOfficiallyVerified,personalDetail(@default,profilePictureUrls),personalDetailSharing,plus,presences(@titleInfo,hasBroadcastData,lastOnlineDate),primaryOnlineStatus,trophySummary(@default)&sort=name-onlineId&userFilter=${filter}&avatarSizes=m&profilePictureSizes=m&offset=0&limit=${limit}`, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Gets info of a user.
	getInfo(PSN) {
		let url = `${Utils.Endpoints.USERS}${PSN}/profile2?fields=npId,onlineId,avatarUrls,plus,aboutMe,languagesUsed,trophySummary(@default,progress,earnedTrophies),isOfficiallyVerified,personalDetail(@default,profilePictureUrls),personalDetailSharing,personalDetailSharingRequestMessageFlag,primaryOnlineStatus,presences(@titleInfo,hasBroadcastData),friendRelation,requestMessageFlag,blocking,mutualFriendsCount,following,followerCount,friendsCount,followingUsersCount&avatarSizes=m,xl&profilePictureSizes=m,xl&languagesUsedLanguageSet=set3&psVitaTitleIcon=circled&titleIconSize=s`;
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Grabs the friends of a public profile or someone on your friends list.
	getFriendsOfFriend(PSN, limit = 36) {
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${PSN}/friends/profiles2?fields=onlineId,avatarUrls,plus,trophySummary(@default),isOfficiallyVerified,personalDetail(@default,profilePictureUrls),primaryOnlineStatus,presences(@titleInfo,hasBroadcastData)&sort=name-onlineId&avatarSizes=m&profilePictureSizes=m,xl&extendPersonalDetailTarget=true&offset=0&limit=${limit}`, $headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Grabs the mutual friends.
	getMutualFriends(PSN, limit = 36) {
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${PSN}/friends/profiles2?fields=onlineId,avatarUrls,plus,trophySummary(@default),isOfficiallyVerified,personalDetail(@default,profilePictureUrls),primaryOnlineStatus,presences(@titleInfo,hasBroadcastData)&sort=name-onlineId&userFilter=mutualFriends&avatarSizes=m&profilePictureSizes=m,xl&extendPersonalDetailTarget=true&offset=0&limit=${limit}`, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Compare all games user trophies
	compareUserTrophies(PSN, limit = 36) {
		let url = `${Utils.Endpoints.TROPHY}trophyTitles?fields=@default&npLanguage=en&iconSize=m&platform=PS3,PSVITA,PS4&offset=0&comparedUser=${PSN}&limit=${limit}`;
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Compare specific game trophies - Short Version
	compareGameUserTrophiesSimple(NPid, PSN) {
		let url = `${Utils.Endpoints.TROPHY}trophyTitles/${NPid}/trophyGroups/?npLanguage=en&comparedUser=${PSN}`;
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return $data;
	}

	// Compare specific game trophies - Extended Version
	compareGameUserTrophiesExtended(NPid, PSN) {
		let url = `${Utils.Endpoints.TROPHY}trophyTitles/${NPid}/trophyGroups/default/trophies?npLanguage=en&comparedUser=${PSN}`;
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Adds a user to your friends list, with an optional message.
	add(PSN, RequestMessage = null) {
		// Since we're not inside the User class, we need to grab the logged in user's onlineId
		let tokens = {
			oauth: this.oauth,
			refresh: this.refresh
		}
		let user = new User(tokens);
		let onlineId = user.me().profile.onlineId;
		let headers = {
			"Authorization": `Bearer ${this.oauth}`,
			"Content-Type": "application/json; charset=utf-8"
		}
		let message = {
			requestMessage: RequestMessage
		}
		let request_message = (RequestMessage) ? JSON.stringify(message) : '{}';
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${onlineId}/friendList/${PSN}`, headers, false, null, "POST", request_message);
		let data = JSON.parse(response.body);
		return data;
	}

	// Removes a friend from your friends list.
	remove(PSN) {
		tokens = {
			oauth: this.oauth,
			refresh: this.refresh
		}
		let user = new User(tokens);
		let onlineId = user.me().profile.onlineId;
		let headers = {
			"Authorization": `Bearer ${this.oauth}`,
			"Content-Type": "application/json; charset=utf-8"
		}
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${onlineId}/friendList/${PSN}`, headers, false, null, "DELETE", null);
		let data = JSON.parse(response.body);
		return data;
	}
}

module.exports = Friends;