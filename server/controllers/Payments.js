const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

// Capture Payment
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid course IDs",
    });
  }

  try {
    let totalAmount = 0;

    // Calculate total amount
    for (const course_id of courses) {
      const course = await Course.findById(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Course with ID ${course_id} not found`,
        });
      }

      // Check if user is already enrolled
      if (course.studentsEnrolled.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: `You are already enrolled in course: ${course.courseName}`,
        });
      }

      totalAmount += course.price;
    }

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log("Razorpay Order:", order);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
};

// Verify Signature and Enroll Students
exports.verifySignature = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, courses } = req.body;
  const userId = req.user.id;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment details are incomplete",
    });
  }

  // Verify payment signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  try {
    const enrollments = courses.map(async (course_id) => {
      const course = await Course.findByIdAndUpdate(
        course_id,
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!course) {
        throw new Error(`Course with ID ${course_id} not found`);
      }

      // Update user courses
      await User.findByIdAndUpdate(
        userId,
        { $push: { courses: course_id } },
        { new: true }
      );

      // Create CourseProgress entry
      const courseProgress = new CourseProgress({
        userID: userId,
        courseID: course_id,
      });
      await courseProgress.save();

      await User.findByIdAndUpdate(
        userId,
        { $push: { courseProgress: courseProgress._id } },
        { new: true }
      );

      // Send enrollment email
      const user = await User.findById(userId);
      const emailTemplate = courseEnrollmentEmail(
        course.courseName,
        `${user.firstName} ${user.lastName}`,
        course.courseDescription,
        course.thumbnail
      );

      await mailSender(
        user.email,
        `Enrollment Successful: ${course.courseName}`,
        emailTemplate
      );
    });

    await Promise.all(enrollments);

    return res.status(200).json({
      success: true,
      message: "Payment verified and courses enrolled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { amount, paymentId, orderId } = req.body;
  const userId = req.user.id;

  if (!amount || !paymentId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid payment details",
    });
  }

  try {
    const user = await User.findById(userId);

    const emailTemplate = paymentSuccess(
      amount / 100, // Convert to INR
      paymentId,
      orderId,
      user.firstName,
      user.lastName
    );

    await mailSender(user.email, "Payment Successful - Study Notion", emailTemplate);

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
