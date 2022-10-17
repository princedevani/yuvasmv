const { Router } = require("express")
const { auth } = require('../middleware/auth')
//const { upload } = require("../utils/multer")
const { userLogin } = require('../controllers/loginController')
const { userLogout, userLogoutAll } = require('../controllers/logoutController')
const { getAdmins } = require('../controllers/memberdetail/getAdminsController')
const { getGroupLeaders } = require("../controllers/memberdetail/getGroupleadersController")
const { getMembers } = require("../controllers/memberdetail/getMembersController")
const { changePassword } = require("../controllers/Password/changePasswordController")
const { forgotPassword } = require("../controllers/Password/forgotPasswordController")
const { getBirthDate } = require("../controllers/todayBirthDateController")
const { uploadProfilePic, getProfilePic, removeProfilePic } = require("../controllers/profilePicController")
const { getLatestEvent } = require("../controllers/Event/getLatestEventController")
const { getSingleMember } = require("../controllers/getSingleMemberController")
const { getPhotos } = require("../controllers/getPhotosController")
const multer = require("multer")
const storage = multer.diskStorage({})
const upload = multer({storage})

const userRouter = Router();


userRouter.post("/login", userLogin)
userRouter.get("/logout", auth, userLogout)
userRouter.get("/logoutall", auth, userLogoutAll)

userRouter.get("/member/:id", auth, getSingleMember)

userRouter.get("/getadmins", auth, getAdmins)
userRouter.post("/getgroupleaders", auth, getGroupLeaders)
userRouter.post("/getmembers", auth, getMembers)

userRouter.post("/forgotpassword", forgotPassword)
userRouter.post("/changepassword", auth, changePassword)
userRouter.get("/todaybirthdate", auth, getBirthDate)

userRouter.post("/uploadprofilepic", auth, upload.single('profile'), uploadProfilePic)
userRouter.post("/changeprofilepic", auth, upload.single('profile'), uploadProfilePic)
userRouter.get("/getprofilepic", auth, getProfilePic)
userRouter.delete("/removeprofilepic", auth, removeProfilePic)

userRouter.get("/getlatestevent", auth, getLatestEvent)

userRouter.get("/getphotos", auth, getPhotos)


module.exports = userRouter;