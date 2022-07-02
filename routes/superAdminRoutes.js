const { Router } = require("express")
const { auth } = require('../middleware/auth')
const { upload } = require("../utils/multer")
const { signup } = require('../controllers/superadmin/adminSignupController')
const { login } = require('../controllers/superadmin/adminLoginController')
const { logout, logoutAll } = require('../controllers/superadmin/adminLogoutController')
const { home } = require('../controllers/superadmin/adminHomeController')
const { createMember } = require('../controllers/member/creatememberController')
const { editMember } = require("../controllers/member/editMemberController")
const { deleteMember } = require("../controllers/member/deleteMemberController")
const { createEvent } = require("../controllers/Event/createEventController")
const { adminChangePassword } = require("../controllers/superadmin/adminChangePasswordController")
const { adminForgotPassword } = require("../controllers/superadmin/adminForgotPasswordController")

const superAdminRouter = Router();

superAdminRouter.post("/superadminsignup", signup)
superAdminRouter.post("/superadminlogin", login)
superAdminRouter.get("/superadminlogout", auth, logout)
superAdminRouter.get("/superadminlogoutall", auth, logoutAll)

superAdminRouter.post("/adminforgotpassword", adminForgotPassword)
superAdminRouter.post("/adminchangepassword", auth, adminChangePassword)

superAdminRouter.get("/superadminhome", auth, home)

superAdminRouter.post("/createmember", auth, createMember)
superAdminRouter.post("/editmember/:id", auth, editMember)
superAdminRouter.delete("/deletemember/:id", auth, deleteMember)

superAdminRouter.post("/createevent", auth, upload.array('photos'), createEvent)


module.exports = superAdminRouter;