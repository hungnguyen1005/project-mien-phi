export const passwordConfig = {
  acceptedPasswords: ["14/2", "14/02", "14-2", "14-02", "1402", "14/2/2026", "14/02/2026"],
  initialHint: "Ngày đầu tiên tụi mình gặp nhau.",
  finalHint: "Ngày Valentine là ngày mấy tháng mấy?",
  firstWrongText: "Yêu thương dữ chưa?",
  repeatedWrongText: "Rồi thôi, tui hiểu con người anh rồi Nguyễn Huy Hoàng.",
  successText: "ồ, bồ em giỏi thế.",
};

export const openingQuestion = {
  id: "question_0_nickname",
  order: 0,
  npcName: "NPC giữ cổng",
  question: "Em từng thích gọi anh Hoàng là gì?",
  options: ["Anh yêu", "Cục vàng", "Baron", "Chồng yêu"],
  correctAnswer: "Cục vàng",
  nextEasyStage: "stage_1_easy",
  nextHardStage: "stage_1_hard",
  correctDialogue: [
    "Đúng rồi đó cục vàng.",
    "Vào map dễ trước nha, coi như em thương anh hôm nay.",
  ],
  wrongDialogue: [
    "Ủa alo, vậy mà cũng quên hả?",
    "Em mở map khó nhẹ cho anh nhớ lâu hơn nha.",
  ],
};

export const relationshipQuestions = [
  {
    id: "question_1_first_kiss",
    order: 1,
    question: "Lần đầu tiên tụi mình hôn nhau là ngày nào?",
    options: ["27/2", "28/2", "26/2", "25/2"],
    correctAnswer: "26/2",
    nextEasyStage: "stage_2_easy",
    nextHardStage: "stage_2_hard",
  },
  {
    id: "question_2_todo",
    order: 2,
    question: "TODO: Em sẽ thay câu hỏi số 2 ở đây.",
    options: ["TODO đáp án A", "TODO đáp án B", "TODO đáp án C", "TODO đáp án D"],
    correctAnswer: "TODO đáp án A",
    nextEasyStage: "stage_3_easy",
    nextHardStage: "stage_3_hard",
    todo: true,
  },
  {
    id: "question_3_special_day",
    order: 3,
    question: "Ngày nào là ngày quan trọng nhất / đặc biệt nhất của mình?",
    options: ["12/3", "14/2", "8/3", "1/3"],
    correctAnswer: "8/3",
    nextEasyStage: "stage_4_easy",
    nextHardStage: "stage_4_hard",
  },
  {
    id: "question_4_long_distance",
    order: 4,
    question: "Tới hôm nay là mình yêu xa được bao nhiêu lâu rồi?",
    options: ["10,454,398 giây", "119 ngày", "2,903 giờ", "174,249 phút"],
    correctAnswer: "2,903 giờ",
    nextEasyStage: "stage_5_easy",
    nextHardStage: "stage_5_hard",
  },
  {
    id: "question_5_steam",
    order: 5,
    question: "Hai đứa mình đã chơi trò nào với nhau nhiều nhất trên Steam?",
    options: ["Backrooms", "Dark Hours", "Minecraft Dungeons", "Marvel Rivals"],
    correctAnswer: "Minecraft Dungeons",
    nextEasyStage: "final_boss",
    nextHardStage: "final_boss",
  },
];

export const getQuestionById = (questionId) =>
  relationshipQuestions.find((question) => question.id === questionId);

export const getQuestionForStage = (stageNumber) =>
  relationshipQuestions.find((question) => question.order === stageNumber);

export const isCorrectAnswer = (question, answer) => question.correctAnswer === answer;

export const normalizePassword = (value) =>
  value.trim().toLowerCase().replace(/\s+/g, "");

export const isPasswordCorrect = (value) => {
  const normalized = normalizePassword(value);
  return passwordConfig.acceptedPasswords.some(
    (password) => normalizePassword(password) === normalized,
  );
};

export const loginQuestions = [
  {
    id: "nickname",
    question: "Em hay gọi anh là gì?",
    correctAnswer: "cục vàng",
    options: ["con baron", "cục vàng", "hoàng", "quàng"],
  },
  {
    id: "sigma",
    question: "Người mà hai đứa mình khó có thể nói chuyện được là ai?",
    correctAnswer: "sigma boy",
    options: ["sigma boy", "khôi", "duy", "nguyên"],
  },
  {
    id: "favorite",
    question: "Em Tấn thích cái gì của anh Hoàng nhất?",
    correctAnswer: "tất cả mọi thứ về anh",
    options: ["đôi mắt", "con baron", "nụ cười", "tất cả mọi thứ về anh"],
  },
];
