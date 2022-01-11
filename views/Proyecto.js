import React, {useState} from "react"
import { StyleSheet, FlatList, Item} from "react-native";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  useBreakpointValue,
  Input,
  Button,
  HStack,
  Center,
  NativeBaseConfigProvider,
  NativeBaseProvider,
  Icon,
  List,
  Content,
  ListItem,
  View,
  Toast
} from "native-base"
import Tarea from "../components/Tarea";
import glogalStyles from "../styles/global";

// Apollo
import {gql, useMutation, useQuery} from '@apollo/client';
import { TouchableOpacity } from "react-native-gesture-handler";

// Crear nuevas tareas
const NUEVA_TAREA = gql`
mutation nuevaTarea($input: TareaInput){
    nuevaTarea(input: $input) {
        nombre
        id
        proyecto
        estado
    }
}
`;

// consulta tarea de l proyecto
const OBTENER_TAREAS = gql`
    query obtenerTareas($input: ProyectoIDInput) {
        obtenerTareas(input: $input) {
            id
            nombre
            estado
        }
    }
`;

const Proyecto = ({route}) => {

    // obtiene el id del proyecto
    const { id } = route.params;

    // state del componente
    const [ nombre, guardarNombre ] = useState('');
    const [ mensaje, guardarMensaje ] = useState(null);

    // apollo obtener tareas
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables: {
            input : {
                proyecto: id
            }
        }
    });

    //console.log(data);

    // apollo crear tareas
    const [ nuevaTarea ] = useMutation(NUEVA_TAREA, {
        update(cache, {data: {nuevaTarea}}){
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: id
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas, nuevaTarea]
                }
            })
        }
    });

    //console.log("hola", data.obtenerTareas);

    const dataTareas = data?.obtenerTareas;

    // Validar y crear tareas
    const handleSubmit = async () => {

        if(nombre === ''){
            guardarMensaje('El nombre de la tarea es obligatorio');
            return;
        }

        // almacenar en la BBDD
        try {
            const { data } = await nuevaTarea({
                variables: {
                    input: {
                        nombre,
                        proyecto: id
                    }
                }
            });

            //console.log(data);
            guardarNombre('');
            guardarMensaje('Tarea creada correctamente');

            setTimeout( () => {
                guardarMensaje(null);
            }, 3000);

        } catch (error) {
            //console.log('error al crear tarea');
            //console.log(error);
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

    // si apollo está consultando
    if(loading) return <Text>Cargando...</Text>

    //console.log(route.params);
    return (
        
        <NativeBaseProvider>

            <Center
                //flex={1}
                px="3"
            >

                <Box
                    safeArea p="2" py="8" w="90%" maxW="290"
                >
                    <Heading
                        size="sm"
                        fontWeight="600"
                        color="coolGray.800"
                        _dark={{
                        color: "warmGray.50",
                        }}
                    >
                        Escribe un nombre y crea.
                    </Heading>

                    <VStack space={3} mt="5">
                        
                        <FormControl>
                            <FormControl.Label>Agregar tareas</FormControl.Label>
                                <Input
                                    value = {nombre}
                                    onChangeText={ texto => guardarNombre(texto) }
                                />
                        </FormControl>

                        <Button 
                            mt="2" style={glogalStyles.btn}
                            onPress={ () => handleSubmit() }
                        >
                            <Text style={glogalStyles.btnTexto}>
                                crear tarea
                            </Text>

                        </Button>

                            <View>
                                <FlatList
                                    data = {dataTareas}
                                    renderItem={ ({tarea, index}) => { 
                                        console.log('desde FlatList',tarea);
                                        return (
                                            <TouchableOpacity>
                                                <Tarea
                                                    tarea = {tarea}
                                                    
                                                />
                                            </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={tarea => tarea.id}
                                />

                            </View>

                        {mensaje && mostrarAlerta()}

                    </VStack>
                </Box>
            </Center>

        </NativeBaseProvider>
        
    );
}
 
export default Proyecto;