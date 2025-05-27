import { Router } from "express";
import { defaultMessage } from "../controller/default.controller";

const router = Router();

router.get("/", defaultMessage)

export default router;