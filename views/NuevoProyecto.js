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
const NUEVO_PROYECTO = gql `
    mutation nuevoProyecto($input: ProyectoInput){
        nuevoProyecto(input : $input) {
            nombre
            id
        }
    }
`;

// actualizar el cache
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

export const Example = () => {

    // navigation
    const navigation = useNavigation();

    // state del componente
    const [nombre, guardarNombre] = useState('');
    const [mensaje, guardarMensaje] = useState(null);

    // Apollo y actualizar cache
    const [nuevoProyecto] = useMutation(NUEVO_PROYECTO, {
        update(cache, { data: { nuevoProyecto } }){
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: { obtenerProyectos: obtenerProyectos.concat([nuevoProyecto]) }
            })
        }
    });

    // Validar crear proyecto
    const handleSubmit = async () => {
        if( nombre === '' ){
            guardarMensaje('El nombre del proyecto es obligatorio');
            return;
        }

        // guardar proyecto ne BBDD
        try {
            const { data } = await nuevoProyecto({
                variables: {
                    input: {
                        nombre
                    }
                }
            });

            console.log(data);
            guardarMensaje('Proyecto creado.');
            navigation.navigate("Proyectos");

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
        Creando nuevo proyecto
        </Heading>

        <VStack space={3} mt="5">

            <FormControl>
                <FormControl.Label>Nombre del Proyecto</FormControl.Label>
                    <Input
                        onChangeText={ texto => guardarNombre(texto) }
                    />
            </FormControl>

            <Button 
                mt="2" style={glogalStyles.btn}
                onPress={ () => handleSubmit() }
            >
                <Text style={glogalStyles.btnTexto}>
                    crear proyecto
                </Text>
            </Button>

            {mensaje && mostrarAlerta()}

        </VStack>
    </Box>
  )
}


const NuevoProyecto = () => {
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
 
export default NuevoProyecto;