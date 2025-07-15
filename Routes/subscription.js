import express from "express";
import authenticateJWT from "../middleware.js"; 



import Subscription from '../Models/Subscription.js';
import crypto from "crypto";

const router = express.Router();

// router.post("/subscribe", authenticateJWT, async (req, res) => {
//     try {
//         const { plan } = req.body;
//         const userId = req.user.id;

//         const planDetails = {
//             "monthly": { cost: 200, duration: 1 },
//             "six-months": { cost: 900, duration: 6 },
//             "yearly": { cost: 1200, duration: 12 }
//         };

//         if (!planDetails[plan.name]) {
//             return res.status(400).json({ success: false, message: "Invalid plan selected" });
//         }

//         const { cost, duration } = planDetails[plan.name];
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + duration);

//         const newSubscription = new Subscription({
//             userId,
//             plan: plan.name,
//             cost,
//             status: "active",
//             startDate,
//             endDate,
//             transactionId: crypto.randomBytes(16).toString("hex")
//         });

//         await newSubscription.save();
//         res.status(201).json({ success: true, message: "Subscription successful", subscription: newSubscription });

//     } catch (error) {
//         console.error("Subscription error:", error);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });
// In your backend route file
router.post("/subscribe", authenticateJWT, async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.user.id;

        const planDetails = {
            "monthly": { cost: 200, duration: 1 },
            "six-months": { cost: 600, duration: 6 },
            "yearly": { cost: 1200, duration: 12 }
        };

        if (!planDetails[plan]) {
            return res.status(400).json({ success: false, message: "Invalid plan selected" });
        }

        const { cost, duration } = planDetails[plan];
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + duration);

        const newSubscription = new Subscription({
            userId,
            plan,
            cost,
            status: "active",
            startDate: new Date(),
            endDate,
            transactionId: crypto.randomBytes(16).toString("hex")
        });

        await newSubscription.save();

        res.status(201).json({
            success: true,
            message: "Subscription successful",
            subscription: newSubscription
        });
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

router.get("/check-subscription", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const subscription = await Subscription.findOne({
            userId,
            status: "active",
            endDate: { $gt: new Date() }
        });

        if (!subscription) {
            return res.json({ subscribed: false });
        }

        res.json({ subscribed: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ subscribed: false, error: "Server error" });
    }
});



export default router;