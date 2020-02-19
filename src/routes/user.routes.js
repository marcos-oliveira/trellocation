const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { User, validate, expiresIn } = require("../models/Usuario");
const express = require("express");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

router.post("/login", async (req, res) => {
  // validate the request name xxx apenas para passar na validação
  const data = { ...req.body, name: 'xxx' };
  const { error } = validate(data);
  if (error) return res.status(400).send(error.details[0].message);
  console.log('find ', data);
  //find an existing user
  await User.findOne({ email: data.email }, function (err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(400).send("Credenciais inválidas!");
      }
      bcrypt.compare(data.password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          const token = user.generateAuthToken();
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            expiresIn: expiresIn,
            authtoken: token
          });
        }else{
          return res.status(400).send("Credenciais inválidas!");
        }
      });
    });
});

module.exports = router;
