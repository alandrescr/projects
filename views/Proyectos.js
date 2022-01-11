import React, {useState} from "react";
import { View } from "react-native";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  NativeBaseConfigProvider,
  Toast,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Divider
} from "native-base"
import { useNavigation } from '@react-navigation/native'
import glogalStyles from "../styles/global";

// Apollo
import {gql, useQuery} from '@apollo/client';

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

export const Example = () => {

    const navigation = useNavigation();

    // APollo
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);

    console.log(data);
    console.log(loading);
    console.log(error);

    //si quitas esto no cargan los proyectos
    if(loading) return <Text>Cargando...</Text>

  return (
    <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Heading
        size="sm"
        fontWeight="600"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        Hola, desde aquí puedes crear o consultar tus proyectos.
      </Heading>

      <VStack space={3} mt="5">

        <Button 
          mt="2" style={glogalStyles.btn}
          onPress={ () => navigation.navigate("NuevoProyecto") }
        >
          <Text style={glogalStyles.btnTexto}>
            crear nuevo proyecto
          </Text>
        </Button>

        <View>
          {data.obtenerProyectos.map(proyecto => (
            <HStack 
              mt="6" justifyContent="center"
              key={proyecto.id}
            >
                <Text
                  style = {glogalStyles.enlace}
                  onPress= { () => navigation.navigate("Proyecto", proyecto) }
                >
                  {proyecto.nombre}
                </Text>
            </HStack>
          ))}
        </View>

      </VStack>
    </Box>
  )
}

const Proyectos = () => {
    return (
        <NativeBaseProvider>
            <Center 
                //flex={1}
                px="3">
                <Example />
            </Center>
        </NativeBaseProvider>
    );
}
 
export default Proyectos;

