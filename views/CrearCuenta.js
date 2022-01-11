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

// Apollo
import {gql, useMutation} from '@apollo/client';
const NUEVACUENTA = gql `
  mutation crearUsuario($input: UsuarioInput){
    crearUsuario(
      input:$input
    )
  }
`;

export const Example = () => {

  // State del formulario
  const [nombre, guardarNombre] = useState('');
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');

  // usando el toast
  const [mensaje, guardarMensaje] = useState(null);

  // React navigation
  const navigation = useNavigation();

  // mutation de Apollo
  const [crearUsuario] = useMutation(NUEVACUENTA);

  // cuando el user presione en crear cuenta
  const handleSubmit = async () => {
    // validar
    if( nombre === '' || email === '' || password === ''){
      // mostrar error
      guardarMensaje('Todos los campos son obligatorios')
      return;
    }

    // pass de 6 o mas caracteres
    if(password.length < 6){
      guardarMensaje('Password de al menos 6 caracteres')
      return;
    }

    // guardar user
    try {
      const { data } = await crearUsuario({
        variables: {
          input:{
            nombre,
            email,
            password
          }
        }
      });

      guardarMensaje(data.crearUsuario);
      navigation.navigate('Login');

    } catch (error) {
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
        Creando Cuenta
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
        ...y es gratis
      </Heading>

      <VStack space={3} mt="5">

        <FormControl>
          <FormControl.Label>Nombre</FormControl.Label>
          <Input
            onChangeText={ texto => guardarNombre(texto) }
          />
        </FormControl>
       
       <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            onChangeText={ texto => guardarEmail(texto) }
          />
        </FormControl>
        
        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            type="password"
            onChangeText={ texto => guardarPassword(texto) }
          />
        </FormControl>

        <Button 
          mt="2" style={glogalStyles.btn}
          onPress={ () => handleSubmit() }
        >
          <Text style={glogalStyles.btnTexto}>
            crear cuenta
          </Text>
        </Button>

        {mensaje && mostrarAlerta()}

      </VStack>
    </Box>
  )
}

const CrearCuenta = () => {
    return (
        <NativeBaseProvider>
            <Center flex={1} px="3">
                <Example />
            </Center>
        </NativeBaseProvider>
    );
}
 
export default CrearCuenta;