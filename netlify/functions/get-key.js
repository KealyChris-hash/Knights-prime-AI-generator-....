// Returns Clerk public key to frontend
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      key: process.env.CLERK_PUBLISHABLE_KEY
    })
  };
};