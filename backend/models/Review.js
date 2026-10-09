const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    correctness: {
      status: {
        type: String,
        required: true,
      },

      explanation: {
        type: String,
        required: true,
      },
    },

    timeComplexity: {
      value: {
        type: String,
        required: true,
      },

      explanation: {
        type: String,
        required: true,
      },
    },

    spaceComplexity: {
      value: {
        type: String,
        required: true,
      },

      explanation: {
        type: String,
        required: true,
      },
    },

    topic: {
      type: String,
      required: true,
    },

    strengths: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    bugs: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);