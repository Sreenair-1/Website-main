import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    // const body = await req.json(); // Removed because frontend sends empty body for now

    // Hardcoded 100 Rs (10000 paise) as requested
    const amount = 10000;
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
      // TODO: Uncomment the 'transfers' array below ONLY after you create a Linked Account 
      // in the Razorpay Dashboard (Route section) and put the real Account ID here.
      // If you leave a fake ID like "acc_placeholder", Razorpay will throw an error and block the payment!
      /*
      transfers: [
        {
          account: "acc_placeholder_expert_id", // Replace this with the real Linked Account ID
          amount: 8000, // 80 Rs to the expert
          currency: "INR",
          notes: {
            name: "Consultation Fee Transfer",
          },
          linked_account_notes: ["name"],
          on_hold: 0, // Transfer immediately
        },
      ],
      */
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
