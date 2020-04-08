const express = require("express");
const app = express();
const ExpressError = require("./expressError");

// for processing JSON:
app.use(express.json());

app.get("/mean", function (req, res, next) {
  let numStrings = req.query.nums.split(",");
  let total = 0;
  try {
    if (numStrings[0] === "") {
      throw new ExpressError("nums are required.", 400);
    }
    for (let num of numStrings) {
      total += Number(num);
      if (isNaN(Number(num))) {
        throw new ExpressError(`${num} is not a number.`, 400);
      }
    }
    let avg = total / numStrings.length;
    return res.json({ response: { operation: "mean", value: avg } });
  } catch (err) {
    return next(err);
  }
});

app.get("/median", function (req, res, next) {
  let numStrings = req.query.nums.split(",");
  let nums = [];
  try {
    if (numStrings[0] === "") {
      throw new ExpressError("nums are required.", 400);
    }
    for (let num of numStrings) {
      nums.push(Number(num));
      if (isNaN(Number(num))) {
        throw new ExpressError(`${num} is not a number.`, 400);
      }
    }
    nums.sort(function (a, b) {
      return a - b;
    });
    let median;
    if (nums.length % 2 === 0) {
      let bottom = nums[nums.length / 2];
      console.log(bottom);
      let top = nums[nums.length / 2 - 1];
      console.log(top);
      median = (top + bottom) / 2;
    } else {
      median = nums[Math.ceil(nums.length / 2) - 1];
    }

    return res.json({ response: { operation: "median", value: median } });
  } catch (err) {
    return next(err);
  }
});

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log("App on port 3000");
});
