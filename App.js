import { Provider } from 'react-redux';
import { store } from './src/store';
import Game from './src/screens/game';
import {
  NavigationContainer,
} from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
export default function App() {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Game />
      </NavigationContainer>
      <StatusBar style={'ligth'} />
    </Provider>
  );
}
