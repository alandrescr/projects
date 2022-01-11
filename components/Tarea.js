import React from 'react';
import {
  Text,
  VStack,
  Center,
  View,
  NativeBaseProvider,
  List
} from "native-base"
import { useNavigation } from '@react-navigation/native'
import glogalStyles from "../styles/global";


const Tarea = (tarea) => {

    return (
      <View>
        <Text
          style = {glogalStyles.titleTarea}
        >
          tarea.nombre
        </Text>          
      </View>       
    );
}
export default Tarea;
