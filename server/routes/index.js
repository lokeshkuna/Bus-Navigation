import { Router } from "express";
import landingRoute from "./signup-login.js";
import authRoutes from "./authRoutes.js";
import homeRouter from "./home.js";
import adminRouter from "./adminRoutes.js";
import busInfoRouter from "./busInfo.js";
import moderatorRouter from "./modRoutes.js";
import apiBusRouter from "./apiBus.js";
import reviewRouter from "./reviewRoutes.js";

const router = Router();

router.use(landingRoute);
router.use(authRoutes);
router.use(homeRouter);
router.use(adminRouter);
router.use(busInfoRouter);
router.use(moderatorRouter);
router.use(apiBusRouter);
router.use(reviewRouter);

export default router;
