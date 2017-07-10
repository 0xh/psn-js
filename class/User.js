const Utils = require("/class/Utils");

class User {
	construct(tokens) {
		this.oauth = tokens.oauth;
		this.refresh_token = tokens.refresh;
	}

	// Pulls info of the current logged in user
	me() {
		let url = `${Utils.Endpoints.USERS}me/profile2?fields=npId,onlineId,avatarUrls,plus,aboutMe,languagesUsed,trophySummary(@default,progress,earnedTrophies),isOfficiallyVerified,personalDetail(@default,profilePictureUrls),personalDetailSharing,personalDetailSharingRequestMessageFlag,primaryOnlineStatus,presences(@titleInfo,hasBroadcastData),friendRelation,requestMessageFlag,blocking,mutualFriendsCount,following,followerCount,friendsCount,followingUsersCount&avatarSizes=m,xl&profilePictureSizes=m,xl&languagesUsedLanguageSet=set3&psVitaTitleIcon=circled&titleIconSize=s`;
		let headers = {
			Authorization: `Bearer ${this.oauth}`
		}
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Blocks a user based on their PSN
	block(PSN) {
		let headers = {
			"Authorization": `Bearer ${this.oauth}`,
			"Content-Type": "application/json; charset=utf-8"
		}
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${this.me().profile.onlineId}/blockList/${PSN}?blockingUsersLimitType=1`, headers, false, null, "POST", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Unblocks a user based on their PSN, assuming they're already blocked by the user.
	unblock(PSN) {
		let headers = {
			"Authorization": `Bearer ${this.oauth}`,
			"Content-Type": "application/json; charset=utf-8"
		}
		let response = Utils.sendRequest(`${Utils.Endpoints.USERS}${this.me().profile.onlineId}/blockList/${PSN}?blockingUsersLimitType=1`, headers, false, null, "DELETE", null);
		let data = JSON.parse(response.body);
		return data;
	}

	// Grabs the recent activity of the PSN user passed.
	getUserActivity(PSN) {
		let headers = {
			"Authorization": `Bearer ${this.oauth}`,
			"Content-Type": "application/json; charset=utf-8"
		}
		let url = `${Utils.Endpoints.ACTIVITY}${PSN}/feed/0?includeComments=true&includeTaggedItems=true&filters=PURCHASED&filters=RATED&filters=VIDEO_UPLOAD&filters=SCREENSHOT_UPLOAD&filters=PLAYED_GAME&filters=WATCHED_VIDEO&filters=TROPHY&filters=BROADCASTING&filters=LIKED&filters=PROFILE_PIC&filters=FRIENDED&filters=CONTENT_SHARE&filters=IN_GAME_POST&filters=RENTED&filters=SUBSCRIBED&filters=FIRST_PLAYED_GAME&filters=IN_APP_POST&filters=APP_WATCHED_VIDEO&filters=SHARE_PLAYED_GAME&filters=VIDEO_UPLOAD_VERIFIED&filters=SCREENSHOT_UPLOAD_VERIFIED&filters=SHARED_EVENT&filters=JOIN_EVENT&filters=TROPHY_UPLOAD&filters=FOLLOWING&filters=RESHARE`;
		let response = Utils.sendRequest(url, headers, false, null, "GET", null);
		let data = JSON.parse(response.body);
		return data;
	}
}

module.exports = User;