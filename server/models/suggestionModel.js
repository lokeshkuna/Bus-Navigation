// models/suggestion.js
import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  suggestion: { type: String, required: true }
});

const suggestionModel = mongoose.model('WebSuggestion', suggestionSchema);

export {suggestionModel};
