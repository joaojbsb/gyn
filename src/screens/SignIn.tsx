import { VStack, Image, Center, Text, Heading, ScrollView } from 'native-base';
import { Image as ImageSVG } from 'react-native';

import logo from '@assets/logo.png';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';



export function SignIn(){
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false} >
            <VStack flex={1} bg="gray.700" px={10} >
                <Image 
                    source={BackgroundImg} 
                    defaultSource={BackgroundImg}
                    alt={'Pessoas no esteira'} 
                    resizeMode="contain"
                    position={'absolute'} 
                />

                <Center my={24}>
                    <ImageSVG source={logo} />

                    <Text color="gray.100" fontSize={'sm'} >
                        Treine sua mente e o seu corpo
                    </Text>
                    
                </Center>

                <Center>
                    <Heading color={"gray.100"} fontSize="xl" fontFamily={"heading"} mb={6} >
                        Acesse sua conta
                    </Heading>

                    <Input placeholder='E-mail' keyboardType='email-address' autoCapitalize='none' />
                    <Input placeholder='Senha' secureTextEntry />

                    <Button title={"Acessar"} />

                </Center>

                <Center mt={24}>
                    <Text color={'gray.100'} fontSize='sm' mb={3} fontFamily='body'>
                        Ainda não tem Acesso
                    </Text>

                    <Button title={"Criar Conta"} variant='outline' onPress={handleNewAccount} />
                </Center>

            </VStack>
        </ScrollView>
    );
}