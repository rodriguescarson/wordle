import { useEffect, useRef } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppSelector, useAppDispatch } from "../../hooks/storeHooks";
import {
  setCurrentGuessIndex,
  setGameWon,
  setSolution,
  setGuesses,
  setUsedKeys,
  setGameEnded,
  setWrongGuessShake,
  setGameStarted,
} from "../../store/slices/gameStateSlice";
import { initialGuesses } from "../../utils/constants";
import { answersEN, wordsEN } from "../../words";
import GameBoard from "./components/gameBoard";

const Game = () => {
  const {
    guesses,
    usedKeys,
    currentGuessIndex,
    gameStarted,
    gameEnded,
    gameWon,
    solution,
  } = useAppSelector((state) => state.gameState);
  const dispatch = useAppDispatch();

  const wordList = () => {
    return wordsEN.concat(answersEN);
  };

  const answers = () => {
    return answersEN;
  };

  const handleFoundKeysOnKeyboard = (guess) => {
    const tempUsedKeys = { ...usedKeys };
    guess.letters.forEach((letter, idx) => {
      const keyValue = tempUsedKeys[letter];
      if (!keyValue) {
        // eslint-disable-next-line
        // @ts-ignore
        tempUsedKeys[letter] = guess.matches[idx];
      } else {
        if (keyValue === "correct") return;
        else if (keyValue && guess.matches[idx] === "correct") {
          tempUsedKeys[letter] = "correct";
        } else if (keyValue === "present" && guess.matches[idx] !== "correct")
          return;
        // eslint-disable-next-line
        // @ts-ignore
        else tempUsedKeys[letter] = guess.matches[idx];
      }
    });
    dispatch(setUsedKeys(tempUsedKeys));
  };

  const checkGameEnd = () => {
    const attemptsCount = guesses.filter((guess) => {
      return guess.isComplete;
    }).length;
    if (attemptsCount === 6) {
      dispatch(setGameEnded(true));
    }
  };

  useEffect(() => {
    checkGameEnd();
  }, [currentGuessIndex]);

  const updateGuess = (keyPressed, currentGuess) => {
    const currentGuessLetters = [...currentGuess.letters];
    let nextEmptyIndex = currentGuessLetters.findIndex(
      (letter) => letter === ""
    );
    if (nextEmptyIndex === -1) nextEmptyIndex = 5;
    const lastNonEmptyIndex = nextEmptyIndex - 1;
    if (keyPressed !== "<" && keyPressed !== "Enter" && nextEmptyIndex < 5) {
      currentGuessLetters[nextEmptyIndex] = keyPressed;
      const updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(setGuesses([...updatedGuesses]));
    } else if (keyPressed === "<") {
      currentGuessLetters[lastNonEmptyIndex] = "";
      const updatedGuess = { ...currentGuess, letters: currentGuessLetters };
      const updatedGuesses = guesses.map((guess, idx) => {
        if (idx === currentGuessIndex) return updatedGuess;
        else return guess;
      });
      dispatch(setGuesses([...updatedGuesses]));
    }
  };

  const checkGuess = (currentGuess) => {
    const currentGuessedWord = currentGuess.letters.join("");
    if (currentGuessedWord.length === 5) {
      if (currentGuessedWord === solution) {
        const matches = ["correct", "correct", "correct", "correct", "correct"];
        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: true,
        };
        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });
        dispatch(setGuesses(updatedGuesses));
        setTimeout(() => {
          dispatch(setGameWon(true));
          dispatch(setGameEnded(true));
          handleFoundKeysOnKeyboard(updatedGuess);
        }, 250 * 6);
      } else if (wordList().includes(currentGuessedWord)) {
        const matches = [];
        currentGuessedWord.split("").forEach((letter, index) => {
          const leftSlice = currentGuessedWord.slice(0, index + 1);
          const countInLeft = leftSlice
            .split("")
            .filter((item) => item === letter).length;
          const totalCount = solution
            .split("")
            .filter((item) => item === letter).length;
          const nonMatchingPairs = solution
            .split("")
            .filter((item, idx) => currentGuessedWord[idx] !== item);

          if (letter === solution[index]) {
            matches.push("correct");
          } else if (solution.includes(letter)) {
            if (
              countInLeft <= totalCount &&
              nonMatchingPairs.includes(letter)
            ) {
              matches.push("present");
            } else {
              matches.push("absent");
            }
          } else {
            matches.push("absent");
          }
        });

        const updatedGuess = {
          ...currentGuess,
          matches,
          isComplete: true,
          isCorrect: false,
        };

        const updatedGuesses = guesses.map((guess, idx) => {
          if (idx === currentGuessIndex) return updatedGuess;
          else return guess;
        });

        dispatch(setGuesses(updatedGuesses));
        dispatch(setCurrentGuessIndex(currentGuessIndex + 1));
        handleFoundKeysOnKeyboard(updatedGuess);
      } else {
        dispatch(setWrongGuessShake(true));
        setTimeout(() => {
          dispatch(setWrongGuessShake(false));
        }, 1000);
      }
    }
  };

  const handleGuess = (keyPressed) => {
    if (!gameEnded) {
      const currentGuess = guesses[currentGuessIndex];
      if (currentGuess) {
        if (keyPressed !== "Enter" && !currentGuess.isComplete) {
          updateGuess(keyPressed, currentGuess);
        } else if (keyPressed === "Enter" && !gameWon) {
          checkGuess(currentGuess);
        }
      }
    }
  };

  const resetGameState = () => {
    dispatch(setGuesses([...initialGuesses]));
  };

  const resetGame = () => {
    dispatch(setGameStarted(true));
    resetGameState();
    dispatch(setCurrentGuessIndex(0));
    dispatch(setUsedKeys([]));
    dispatch(setGameWon(false));
    dispatch(setGameEnded(false));
    dispatch(
      setSolution(answers()[Math.floor(Math.random() * answers().length)])
    );
  };
  if (!gameStarted)
    return (
      <View style={styles.newGameScreen}>
        <TouchableOpacity onPress={resetGame}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              backgroundColor: "orange",
              margin: 10,
              padding: 18,
              borderRadius: 10,
            }}
          >
            Start a new game
          </Text>
          <Text
            style={{
              color: "black",
              fontSize: 12,
              margin: 10,
              padding: 18,
              borderRadius: 10,
            }}
          >
            By Carson Rodrigues
          </Text>
        </TouchableOpacity>
      </View>
    );
  return (
    <View style={{ position: "relative" }}>
      <GameBoard
        solution={solution}
        handleGuess={handleGuess}
        resetGame={resetGame}
      />
    </View>
  );
};

export default Game;
const styles = StyleSheet.create({
  newGameScreen: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
