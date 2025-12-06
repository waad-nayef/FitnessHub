//This file is temporary and will be deleted after the website is completed.

// ===================== Users =====================
const users = [
  { id: "u1", fullName: "Waad Nayef", email: "waad@example.com", phoneNumber: "0123456789", password: "password123", isAdmin: true, createdAt: "01-11-2025", },
  { id: "u2", fullName: "Ahmad Khalid", email: "ahmad@example.com", phoneNumber: "0123456789", password: "ahmadpass", isAdmin: false, createdAt: "05-11-2025", submittedForms: 0, averageScore: 98 },
  { id: "u3", fullName: "Sara Omar", email: "sara@example.com", phoneNumber: "0123456789", password: "sarapass", isAdmin: false, createdAt: "10-11-2025", submittedForms: 1, averageScore: 98 },
  { id: "u4", fullName: "Fadi Saleh", email: "fadi@example.com", phoneNumber: "0123456789", password: "fadipass", isAdmin: false, createdAt: "12-11-2025", submittedForms: 5, averageScore: 98 },
  { id: "u5", fullName: "Lina Maher", email: "lina@example.com", phoneNumber: "0123456789", password: "linapass", isAdmin: false, createdAt: "15-11-2025", submittedForms: 8, averageScore: 98 },
  { id: "u6", fullName: "Omar Youssef", email: "omar@example.com", phoneNumber: "0123456789", password: "omarpass", isAdmin: false, createdAt: "18-11-2025", submittedForms: 0, averageScore: 98 }
];
localStorage.setItem("users", JSON.stringify(users));

// ===================== Forms =====================
const forms = [
  {
    formId: "f1",
    title: "Gym Basics Quiz",
    description: "Test your knowledge on gym exercises and fitness.",
    status: "active",
    createdAt: "20-11-2025",
    average: 90, //out of 100%
    noOfSubmission: 40,
    totalMark: 30, //the mark will be converted to out of 100%
    maxScore: 98,
    questions: [
      {
        questionId: "q1",
        text: "What is the correct form for a squat?",
        type: "radio",
        mark: 2,
        isRequired: true,
        styling: { bold: true, italic: false, underline: false, font: "Arial" },
        options: [
          { id: "o1", text: "Straight back, knees forward" },
          { id: "o2", text: "Back rounded, knees forward" },
          { id: "o3", text: "Straight back, knees behind toes" }
        ],
        correctAnswerId: "o1"
      },
      {
        questionId: "q2",
        text: "BMI stands for?",
        type: "text",
        mark: 1,
        isRequired: true,
        styling: { bold: false, italic: true, underline: false, font: "Times New Roman" },
        correctAnswer: "Body Mass Index"
      },
      {
        questionId: "q3",
        text: "Which exercises target the chest muscles?",
        type: "select",
        mark: 3,
        isRequired: true,
        styling: { bold: true, italic: true, underline: false, font: "Verdana" },
        options: [
          { id: "o1", text: "Bench Press" },
          { id: "o2", text: "Push Ups" },
          { id: "o3", text: "Bicep Curl" }
        ],
        correctAnswerIds: ["o1", "o2"]
      }
    ]
  },
  {
    formId: "f2",
    title: "Advanced Training Quiz",
    description: "Challenge your advanced fitness knowledge.",
    status: "inactive",
    createdAt: "22-11-2025",
    average: 90, //out of 100%
    noOfSubmission: 40,
    totalMark: 30, //the mark will be converted to out of 100%
    maxScore: 98,
    questions: [
      {
        questionId: "q1",
        text: "Which nutrient is most important for muscle recovery?",
        type: "radio",
        mark: 2,
        isRequired: true,
        styling: { bold: true, italic: false, underline: false, font: "Arial" },
        options: [
          { id: "o1", text: "Protein" },
          { id: "o2", text: "Carbs" },
          { id: "o3", text: "Fats" }
        ],
        correctAnswerId: "o1"
      },
      {
        questionId: "q2",
        text: "Recommended sets for hypertrophy?",
        type: "text",
        mark: 1,
        isRequired: true,
        styling: { bold: false, italic: false, underline: false, font: "Calibri" },
        correctAnswer: "3-5 sets"
      },
      {
        questionId: "q3",
        text: "Select all compound exercises:",
        type: "select",
        mark: 3,
        isRequired: true,
        styling: { bold: true, italic: true, underline: false, font: "Verdana" },
        options: [
          { id: "o1", text: "Deadlift" },
          { id: "o2", text: "Squat" },
          { id: "o3", text: "Bench Press" },
          { id: "o4", text: "Bicep Curl" }
        ],
        correctAnswerIds: ["o1", "o2", "o3"]
      }
    ]
  },
  {
    formId: "f3",
    title: "Cardio Quiz",
    description: "Check your knowledge on cardiovascular training.",
    status: "active",
    createdAt: "23-11-2025",
    average: 90, //out of 100%
    noOfSubmission: 40,
    totalMark: 30, //the mark will be converted to out of 100%
    maxScore: 98,
    questions: [
      {
        questionId: "q1",
        text: "Which exercise is considered high-intensity cardio?",
        type: "radio",
        mark: 2,
        isRequired: true,
        styling: { bold: true, italic: false, underline: false, font: "Arial" },
        options: [
          { id: "o1", text: "Sprint intervals" },
          { id: "o2", text: "Jogging" },
          { id: "o3", text: "Walking" }
        ],
        correctAnswerId: "o1"
      },
      {
        questionId: "q2",
        text: "Best heart rate zone for fat burning?",
        type: "text",
        mark: 1,
        isRequired: true,
        styling: { bold: false, italic: true, underline: false, font: "Times New Roman" },
        correctAnswer: "60-70% of max heart rate"
      },
      {
        questionId: "q3",
        text: "Select cardio equipment:",
        type: "select",
        mark: 3,
        isRequired: true,
        styling: { bold: true, italic: true, underline: false, font: "Verdana" },
        options: [
          { id: "o1", text: "Treadmill" },
          { id: "o2", text: "Elliptical" },
          { id: "o3", text: "Stationary Bike" },
          { id: "o4", text: "Rowing Machine" }
        ],
        correctAnswerIds: ["o1", "o2", "o3", "o4"]
      }
    ]
  }
];
localStorage.setItem("forms", JSON.stringify(forms));

// ===================== Submissions =====================
const submissions = [
  {
    submissionId: "s1",
    formId: "f1",
    userId: "u2",
    answers: [
      { questionId: "q1", userAnswer: "o1" },
      { questionId: "q2", userAnswer: "text" }, //equality
      { questionId: "q3", userAnswer: "o1" }
    ],
    score: 96,
    submittedAt: "26-11-2025"
  },
  {
    submissionId: "s2",
    formId: "f1",
    userId: "u3",
    answers: [
      { questionId: "q1", userAnswer: "o1" },
      { questionId: "q2", userAnswer: "o1" },
      { questionId: "q3", userAnswer: "o1" }
    ],
    score: 1, // only q2 correct
    submittedAt: "26-11-2025"
  },
  {
    submissionId: "s3",
    formId: "f3",
    userId: "u4",
    answers: [
      { questionId: "q1", userAnswer: "o1" },
      { questionId: "q2", userAnswer: "o1" },
      { questionId: "q3", userAnswer: "o1" }
    ],
    score: 6, // 2 + 1 + 3
    submittedAt: "27-11-2025"
  }
];
localStorage.setItem("submissions", JSON.stringify(submissions));

// ===================== Current User =====================
localStorage.setItem("currentUser", "u1");