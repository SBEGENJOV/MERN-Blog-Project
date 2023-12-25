const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
    },  //Neyin şifrelernecegini belirliyoruz
  };
  const token = jwt.sign(payload, "anykey", {
    expiresIn: 36000, 
  });  // expiresIn : süreyi belirtmek için kullanılır
  return token;
};

module.exports = generateToken;
