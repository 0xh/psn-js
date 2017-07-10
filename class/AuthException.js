class AuthException {
	construct(json) {
		let error;
		this.error = json;
	}

	function getError() {
		return this.error;
	}
	
	function getErrorMessage() {
		return this.error.errorDescription;
	}
	
	function getErrorCode() {
		return this.error.errorCode;
	}
}

module.exports = AuthException;