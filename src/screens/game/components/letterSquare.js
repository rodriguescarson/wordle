import { useEffect } from 'react';

import { StyleSheet, Text, Vibration,View } from 'react-native';

import { useAppSelector } from '../../../hooks/storeHooks';
import { adjustLetterDisplay } from '../../../utils/adjustLetterDisplay';
import { colors, SIZE } from '../../../utils/constants';
const LetterSquare = ({ guess, letter, idx }) => {
  const { currentGuessIndex, wrongGuessShake } = useAppSelector(
    (state) => state.gameState
  );
  const matchStatus = guess.matches[idx];

  function matchColor() {
    'worklet';
    switch (matchStatus) {
      case 'correct':
        return colors.correct;
      case 'present':
        return colors.present;
      case 'absent':
        return colors.absent;
      case '':
        return colors.keyDefault;
      default:
        return colors.keyDefault;
    }
  }


  useEffect(() => {
    if (letter !== '' && matchStatus === '') {
      Vibration.vibrate(1);
    }
    if (matchStatus !== '') {

    }
  }, [letter, matchStatus]);

  useEffect(() => {
    if (wrongGuessShake && currentGuessIndex === guess.id) {
      for (let i = 1; i < 6; i++) {
      }
    }
  }, [wrongGuessShake]);

  return (
    <View
      key={idx}
      style={[
        {
          ...styles.square,
          backgroundColor: matchColor(),
          borderWidth: guess.isComplete ? 0 : 1,
        },
      ]}
    >
      <Text
        style={{
          ...styles.letter,
          color: colors.white,
        }}
      >
        {adjustLetterDisplay(letter)}
      </Text>
    </View>
  );
};

export default LetterSquare;

const styles = StyleSheet.create({
  square: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE / 6.5,
    height: SIZE / 6.5,
    borderRadius: 10,
  },
  letter: {
    fontSize: SIZE / 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
