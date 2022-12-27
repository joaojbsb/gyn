import { useState } from 'react';
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from 'native-base';
import { Image as ImageSVG } from 'react-native';

import logo from '@assets/logo.png';
import BackgroundImg from '@assets/background.png';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';

type FormData = {
    email: string,
    password: string,
};

export function SignIn(){
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();

    const { control, handleSubmit } = useForm<FormData>();
    const { signIn } = useAuth();

    function handleNewAccount(){
        navigation.navigate('signUp');
    };

    async function handleSignIn({email, password}: FormData){
        try {
            setIsLoading(true)
            await signIn(email, password);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível acessar. Tente novamente mais tarde. '
        
            setIsLoading(false);

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    };



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
                    <Heading  color={"gray.100"} fontSize="xl" fontFamily={"heading"} mb={6} >
                        Acesse sua conta
                    </Heading>

                    <Controller 
                        control={control}
                        name={"email"}
                        render={({ field: {onChange, value} }) => (
                            <Input 
                                placeholder='E-mail' 
                                keyboardType='email-address' 
                                autoCapitalize='none' 
                                onChangeText={onChange}  
                                value={value}  
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name={"password"}
                        render={({ field: {onChange, value} }) => (
                            <Input 
                                placeholder='Senha' 
                                secureTextEntry
                                onChangeText={onChange} 
                                value={value}   
                            />
                        )}
                    />

                    <Button 
                        title={"Acessar"} 
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />

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