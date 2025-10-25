// Configuration des moods avec yeux, bouche et background items
export const MOOD_STYLES = {
  0: { // HAPPY
    name: "Happy",
    eyes: "Y1",
    mouth: "B1",
    bgItem: "BGI5",
    headColor: "#FFD4A3",
    bodyColor: "#FFE4B5",
    bgColor: "#FFF8DC"
  },
  1: { // SAD
    name: "Sad",
    eyes: "Y4",
    mouth: "B2",
    bgItem: "BGI2",
    headColor: "#B4D4FF",
    bodyColor: "#C8E6FF",
    bgColor: "#E8F4FF"
  },
  2: { // ANGER
    name: "Anger",
    eyes: "Y5",
    mouth: "B3",
    bgItem: "BGI7",
    headColor: "#FF9999",
    bodyColor: "#FFCCCC",
    bgColor: "#FFE0E0"
  },
  3: { // FEAR
    name: "Fear",
    eyes: "Y2",
    mouth: "B4",
    bgItem: "BGI3",
    headColor: "#E5D4FF",
    bodyColor: "#F0E6FF",
    bgColor: "#FAF5FF"
  },
  4: { // SURPRISE
    name: "Surprise",
    eyes: "Y2",
    mouth: "B6",
    bgItem: "BGI4",
    headColor: "#FFE4F0",
    bodyColor: "#FFF0F8",
    bgColor: "#FFF8FC"
  },
  5: { // BOREDOM
    name: "Boredom",
    eyes: "Y7",
    mouth: "B5",
    bgItem: "BGI1",
    headColor: "#D3D3D3",
    bodyColor: "#E8E8E8",
    bgColor: "#F5F5F5"
  },
  6: { // SHAME
    name: "Shame",
    eyes: "Y3",
    mouth: "B2",
    bgItem: "BGI6",
    headColor: "#FFD4E5",
    bodyColor: "#FFE4F0",
    bgColor: "#FFF0F8"
  },
  7: { // DETERMINATION
    name: "Determination",
    eyes: "Y5",
    mouth: "B8",
    bgItem: "BGI8",
    headColor: "#FFB347",
    bodyColor: "#FFCC80",
    bgColor: "#FFE0B2"
  },
  8: { // EXCITEMENT
    name: "Excitement",
    eyes: "Y2",
    mouth: "B7",
    bgItem: "BGI9",
    headColor: "#FFB3D9",
    bodyColor: "#FFD4E5",
    bgColor: "#FFE6F0"
  },
  9: { // KAWAII
    name: "Kawaii",
    eyes: "Y6",
    mouth: "B9",
    bgItem: "BGI5",
    headColor: "#FFD4E5",
    bodyColor: "#FFE6F0",
    bgColor: "#FFF0F8"
  },
  10: { // SLEEPY
    name: "Sleepy",
    eyes: "Y6",
    mouth: "B8",
    bgItem: "BGI2",
    headColor: "#E6E6FA",
    bodyColor: "#F0F0FF",
    bgColor: "#FAF0FF"
  },
  11: { // MISCHIEVOUS
    name: "Mischievous",
    eyes: "Y5",
    mouth: "B5",
    bgItem: "BGI7",
    headColor: "#B3FFB3",
    bodyColor: "#D4FFD4",
    bgColor: "#E6FFE6"
  }
} as const

export type MoodId = keyof typeof MOOD_STYLES
