require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { holdingsModel } = require("./models/holdingsModel");
const { ordersModel } = require("./models/ordersModel");
const { usersModel } = require("./models/usersModel");
const auth = require("./middlwares");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://investx-land1.onrender.com",
  "https://investx-dashboard.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(bodyParser.json());

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(url);
}

// app.get("/addHoldings", async (req, res) => {
//   let temp = [
//     {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
//   ];

//   try {
//     temp.forEach((item) => {
//       let holding = new holdingsModel({
//         name: item.name,
//         qty: item.qty,
//         avg: item.avg,
//         price: item.price,
//         net: item.net,
//         day: item.day,
//       });

//       holding.save();
//     });
//     res.send("done");
//   } catch (e) {
//     console.log(e);
//   }
// });

app.get("/allHoldings", auth, async (req, res) => {
  let allHoldings = await holdingsModel.find({ user: req.user.id });
  res.json(allHoldings);
});

app.post("/newOrder", auth, async (req, res) => {
  const { name, qty, price, mode } = req.body;

  // Save order
  await ordersModel.create({
    user: req.user.id,

    ...req.body,
  });

  let holding = await holdingsModel.findOne({
    user: req.user.id,
    name,
  });

  if (mode === "BUY") {
    if (holding) {
      const totalCost =
        Number(holding.qty) * Number(holding.avg) + Number(qty) * Number(price);

      holding.qty = Number(holding.qty) + Number(qty);

      holding.avg = totalCost / holding.qty;
      holding.price = price;
      holding.net = String((((price - holding.avg) / holding.avg) * 100).toFixed(2)) + "%";

      await holding.save();
    } else {
      await holdingsModel.create({
        user: req.user.id,
        name,
        qty,
        avg: price,
        price,
      });
    }
  } else {
    if (!holding) {
      return res.status(400).json({
        success: false,
        message: "You do not own this stock.",
      });
    }

    // Trying to sell more than owned
    if (qty > holding.qty) {
      return res.status(400).json({
        success: false,
        message: `You only own ${holding.qty} shares of ${name}.`,
      });
    }

    if (holding) {
      holding.qty -= Number(qty);

      if (holding.qty <= 0) {
        await holdingsModel.deleteOne({ name });
      } else {
        holding.price = Number(price);
        await holding.save();
      }
    }
  }

  res.json({ success: true });
});

app.get("/orders", auth, async (req, res) => {
  const orders = await ordersModel.find({ user: req.user.id });
  res.json(orders);
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await usersModel.findOne({ email });

    if (userExists)
      return res.status(400).json({
        message: "User already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await usersModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "Invalid Credentials",
      });

    // console.log("Entered password:", password);
    // console.log("Stored password:", user.password);

    const match = await bcrypt.compare(password, user.password);

    // console.log("Password match:", match);

    if (!match)
      return res.status(401).json({
        message: "Invalid Credentials",
      });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

app.get("/verify", auth, (req, res) => {
  res.json({
    success: true,

    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
