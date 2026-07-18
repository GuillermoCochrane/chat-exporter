export default [
  {
    id: "1",
    parent: null,
    children: ["2"],
    role: "user",
    createTime: 123456789,
    rawContent: {
      parts: [
        "Hola",
        "Mundo"
      ]
    }
  },

  {
    id: "2",
    parent: "1",
    children: [],
    role: "assistant",
    createTime: 123456790,
    rawContent: {
      parts: [
        "Respuesta"
      ]
    }
  },

  {
    id: "3",
    parent: "2",
    children: [],
    role: "assistant",
    createTime: null,
    rawContent: {}
  }
];