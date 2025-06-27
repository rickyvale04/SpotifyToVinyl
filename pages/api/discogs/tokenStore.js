const fs = require('fs');
const path = require('path');

// Path to temporary token storage file
const TOKEN_STORE_PATH = path.join(process.cwd(), 'tmp', 'discogs_tokens.json');

// Ensure the tmp directory exists
const ensureTmpDir = () => {
  const tmpDir = path.dirname(TOKEN_STORE_PATH);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
};

// Read token store from file
const readTokenStore = () => {
  ensureTmpDir();
  try {
    if (fs.existsSync(TOKEN_STORE_PATH)) {
      const data = fs.readFileSync(TOKEN_STORE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading token store:', error);
  }
  return {};
};

// Write token store to file
const writeTokenStore = (store) => {
  ensureTmpDir();
  try {
    fs.writeFileSync(TOKEN_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing token store:', error);
    return false;
  }
};

// Store a request token secret
exports.storeRequestTokenSecret = (requestToken, requestTokenSecret) => {
  const store = readTokenStore();
  store[requestToken] = {
    secret: requestTokenSecret,
    timestamp: Date.now(),
    expiresIn: 600000, // 10 minutes in milliseconds
  };
  return writeTokenStore(store);
};

// Retrieve a request token secret
exports.getRequestTokenSecret = (requestToken) => {
  const store = readTokenStore();
  const tokenData = store[requestToken];
  if (tokenData) {
    // Check if the token is still valid (not expired)
    if (Date.now() - tokenData.timestamp < tokenData.expiresIn) {
      return tokenData.secret;
    } else {
      // Remove expired token
      delete store[requestToken];
      writeTokenStore(store);
    }
  }
  return null;
};

// Clear a request token secret
exports.clearRequestTokenSecret = (requestToken) => {
  const store = readTokenStore();
  delete store[requestToken];
  return writeTokenStore(store);
};
