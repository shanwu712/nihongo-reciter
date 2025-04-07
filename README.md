# Nihongo Reciter

**Nihongo Reciter** is a web application designed for Japanese language learners to build their own vocabulary list and test themselves through a customizable fill-in-the-blank quiz.

## Demo

This project is deployed with Github Pages and available here 👉 [Nihongo Reciter](https://shanwu712.github.io/nihongo-reciter/)

## How to Use

1. **Add Vocabulary**  
   On the main page, fill in the Japanese word, its reading, and its meaning, then click `送出 (Submit)` to add it to the list.

2. **Manage Vocabulary**  
   View all added words in a table and remove any item by clicking the `刪除 (Delete)` button next to it.

3. **Start a Quiz**  
   Click the `開始考試 (Start Quiz)` button, select the number of questions, and begin answering fill-in-the-blank questions.

4. **View Results**  
   After submitting the quiz, you'll receive a score and a list of incorrectly answered items for review.

## Technical Overview

- **Frontend**: Pure JavaScript, HTML, and CSS (no frameworks used)
- **Data Storage**: Uses `localStorage` to persist data locally in the browser

## Features (with screenshots)

- **Vocabulary Management**  
  Users can manually input Japanese words, their readings (in Hiragana), and meanings (in English or Chinese), and manage them in a word list. Each word item can also be deleted.

- **Edit Mode**  
  You can click the "編集單字表 (Edit Vocabulary List)" button to enable delete buttons for each word entry.

  ![Edit Mode](https://github.com/user-attachments/assets/d3432223-1238-4ce0-b6f8-6b8a85f75374)
  
- **Quiz Mode**  
  Clicking the “開始考試 (Start Quiz)” button prompts the user to choose between 5, 10, or 15 questions.

  ![Quiz Prompt](https://github.com/user-attachments/assets/42022d79-6561-47ed-b7eb-595bedbafab3)

- **Fill-in-the-Blank Questions**  
  The quiz randomly selects vocabulary and blanks out one of the fields (word, reading, or meaning). Users must fill in the correct answer.

  ![Quiz View](https://github.com/user-attachments/assets/e30563e2-f1be-40d5-924c-c180b708ea4c)

- **Scoring System**  
  After submitting the quiz, the app calculates a score out of 100 and shows the questions answered incorrectly in red.

  ![Results Page](https://github.com/user-attachments/assets/b0a728f1-e370-4916-bb90-317b66d8572b)

