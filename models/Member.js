const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const JWT_SECRET = "yuvasmv";

const memberSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isLength(value, { min: 3 })) {
        throw new Error("Name should have atleast 3 characters");
      }
    },
  },
  memberid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Enter a valid email address");
      }
    },
  },
  mobile: {
    type: Number,
    required: true,
  },
  membertype: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  groupleader: {
    type: String,
    required() {
      return this.membertype !== "groupleader" && this.membertype !== "admin";
    },
  },
  mentor: {
    type: String,
    required() {
      return this.membertype !== "admin";
    },
  },
  address: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  profile: {
    pid:{
      type: String,
      default: "default-profile/blank-profile_ppt6u7"
    },
    purl:{
      type: String,
      default: "https://res.cloudinary.com/karishma027/image/upload/v1655189955/default-profile/blank-profile_ppt6u7.webp"
    }
  }
});

memberSchema.pre("save", async function (next) {
  const member = this;
  member.birthdate = moment(member.birthdate, "YYYY-MM-DD").toDate();

  if (member.isModified("password")) {
    member.password = await bcrypt.hash(member.password, 8);
  }
  next();
});

memberSchema.methods.generateAuthToken = async function () {
  const member = this;
  const token = jwt.sign({ _id: member._id.toString() }, JWT_SECRET);

  member.tokens = member.tokens.concat({ token });
  await member.save();

  return token;
};

memberSchema.statics.findByCredentials = async (userid, password) => {
  const member = validator.isEmail(userid)
    ? await Member.findOne({ email: userid })
    : await Member.findOne({ mobile: userid });
  if (!member) {
    throw new Error(
      "There is no account with given email address. Please register first to login !"
    );
  }
  const isMatch = await bcrypt.compare(password, member.password);
  if (!isMatch) {
    throw new Error("The entered password is incorrect");
  }
  return member;
};

memberSchema.statics.getMemberInfo = async (userid) => {
  const member = validator.isEmail(userid)
    ? await Member.findOne({ email: userid })
    : await Member.findOne({ mobile: userid });

  if (!member) {
    throw new Error("Member is not present");
  }
  return member;
};

memberSchema.statics.getMemberById = async (_id) => {

  const user = await Member.findById({_id})
  if(!user){
      throw new Error('User is not present')
  }
  return user

};

memberSchema.statics.checkMember = async (userid) => {
  const member = validator.isEmail(userid)
    ? await Member.findOne({ email: userid })
    : await Member.findOne({ mobile: userid });
  return member ? true : false;
};

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
