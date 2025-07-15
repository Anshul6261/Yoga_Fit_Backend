import mongoose from "mongoose";  // ✅ Use ES module import

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["monthly", "six-months", "yearly"], required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    transactionId: { type: String, required: true },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;  // ✅ Use ES Module export

