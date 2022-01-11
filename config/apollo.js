import { ApolloClient } from "@apollo/client";
//import { InMemoryCache } from 'apollo-cache-inmemory';
import { InMemoryCache } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from "apollo-link-context";

import { Platform } from 'react-native';
import AsyncStorageLib from "@react-native-async-storage/async-storage";

const httpLink = createHttpLink({
    uri: Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://10.0.2.2:4000/'
})

const authLink = setContext( async (_, {headers}) => {
    //Leer el token
    const token = await AsyncStorageLib.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

export default client;

//
//import{ApolloClient, InMemoryCache} from '@apollo/client';
/* const client = new ApolloClient({
    uri: 'localhost:4000/',
    cache: new InMemoryCache()
}); */