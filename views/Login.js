import React, {useState} from "react"
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
  Toast
} from "native-base"
import { useNavigation } from '@react-navigation/native'
import glogalStyles from "../styles/global";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

// Apollo
import {gql, useMutation} from '@apollo/client';
const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput){
    autenticarUsuario(input: $input){
      token
    }
  }
`;

export const Example = () => {

  // State del formulario
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');

  // usando el toast
  const [mensaje, guardarMensaje] = useState(null);

  // React navigation
  const navigation = useNavigation();

  // Mutation de Apollo
  const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO)

  // cuando el user presiona, inicia sesión
  const handleSubmit = async () => {
    // validar
    if( email === '' || password === ''){
      // mostrar error
      guardarMensaje('Todos los campos son obligatorios')
      return;
    }

    try {
      // autenticar al user
      const {data} = await autenticarUsuario({
        variables:{
          input: {
            email,
            password
          }
        }
      });

      const { token } = data.autenticarUsuario;

      // token
      await AsyncStorageLib.setItem('token', token);

      // redireccionar a proyectos
      navigation.navigate('Proyectos');

    } catch (error) {
      console.log('error aqui');
      guardarMensaje(error.message.replace('GraphQL error: ', ''));
    }
  }

  // muestra un mensaje toast
  const mostrarAlerta = () => {
    Toast.show({
      description: mensaje,
      buttonText: 'OK',
      duration: 4000
    })
  }

  return (
    <Box safeArea p="2" py="8" w="90%" maxW="290">
      <Heading
        size="lg"
        fontWeight="600"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        proProject APP
      </Heading>
      <Heading
        mt="1"
        _dark={{
          color: "warmGray.200",
        }}
        color="coolGray.600"
        fontWeight="medium"
        size="xs"
      >
        Tus proyectos paso a paso
      </Heading>

      <VStack space={3} mt="5">

        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            onChangeText={texto => guardarEmail(texto.toLowerCase())}
            value={email}
          />
        </FormControl>
        
        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            type="password"
            onChangeText={texto => guardarPassword(texto)}
          />
        </FormControl>

        <Button 
          mt="2" style={glogalStyles.btn}
          onPress={() => handleSubmit()}
        >
          <Text style={glogalStyles.btnTexto}>
            iniciar sesión
          </Text>
        </Button>

        <HStack mt="6" justifyContent="center">
          <Text
            onPress={ () => navigation.navigate("CrearCuenta") }
            style = {glogalStyles.enlace}
          >
            crear cuenta
          </Text>
        </HStack>

        {mensaje && mostrarAlerta()}

      </VStack>
    </Box>
  )
}

const Login = () => {
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Example />
            </Center>
        </NativeBaseProvider>
    );
}
 
export default Login;