// Simple random code generator that changes every 60 seconds
class TOTPGenerator {
  constructor() {
    this.digits = 6;
    this.period = 60; // 60 seconds
    this._lastToken = null;
    this._lastGenTime = 0;
  }

  generate() {
    const now = Math.floor(Date.now() / 1000);
    const currentPeriod = Math.floor(now / this.period);

    // Only generate a new token if we've moved to a new time period
    if (this._lastGenTime !== currentPeriod) {
      // Generate a random 6-digit number
      let token = "";
      for (let i = 0; i < this.digits; i++) {
        token += Math.floor(Math.random() * 10).toString();
      }

      this._lastToken = token;
      this._lastGenTime = currentPeriod;

      // Print the new token to console
      console.log(`New token generated: ${token} (valid for 60 seconds)`);
    }

    return this._lastToken;
  }

  // Get seconds remaining until next token
  getSecondsRemaining() {
    const now = Math.floor(Date.now() / 1000);
    const nextChange = (this._lastGenTime + 1) * this.period;
    return nextChange - now;
  }
}

// Global instance of the generator
const totpGenerator = new TOTPGenerator();

// Function to verify TOTP
function verifyTOTP(userToken) {
  // Generate current token
  const currentToken = totpGenerator.generate();

  //   // For testing, log the correct token and time remaining
  const timeRemaining = totpGenerator.getSecondsRemaining();
  console.log(
    `Verifying token: ${currentToken} (${timeRemaining} seconds remaining)`
  );

  //   // Compare user input with generated token
  return currentToken === userToken;
}

// Initialize by generating the first token
totpGenerator.generate();
