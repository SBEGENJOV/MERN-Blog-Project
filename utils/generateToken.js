const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },  //Neyin şifrelernecegini belirliyoruz
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: 36000, 
  });  // expiresIn : süreyi belirtmek için kullanılır. "anykey" bir anahtardır bu jwt yi çözmek için çözülecegi yerde bunu girmek gerekir.
  return token;
};

module.exports = generateToken;
