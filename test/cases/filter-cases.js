export default [
  {
    role: "system",
    rawContent: { content_type: "text" }
  },

  {
    role: "user",
    rawContent: { content_type: "text" }
  },

  {
    role: "assistant",
    rawContent: { content_type: "text" }
  },

  {
    role: "assistant",
    rawContent: { content_type: "model_editable_context" }
  },

  {
    role: "user",
    rawContent: { content_type: "user_editable_context" }
  },

  {
    role: "developer",
    rawContent: { content_type: "text" }
  }
];