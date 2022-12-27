import { HStack, Icon, VStack, Text, Heading, ScrollView, Image, Box, useToast } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Button } from '@components/Button';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useEffect, useState } from 'react';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';

type RouteParamsProps = {
    exerciseId: string;
};

export function Exercise(){
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
    const [isLoading, setIsLoading] = useState(true);
    const [sendingRegister, setSendingRegister] = useState(false);

    const navigation = useNavigation<AppNavigatorRoutesProps>();
    const route = useRoute();
    const toast = useToast();

    const { exerciseId } = route.params as RouteParamsProps;

    function handleGoBack(){
        navigation.goBack();
    };

    async function fetchExerciseDetails(){
        try {
            setIsLoading(true);

            const response = await api.get(`/exercises/${exerciseId}`);
            setExercise(response.data);
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message: 'Não foi possível carregar o exercício selecionado.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setIsLoading(false);
        }
    };

    async function handleExercisehistoryRegister(){
        try {
            setSendingRegister(true);

            await api.post('/history', {exercise_id: exerciseId});

            toast.show({
                title: 'Parabéms, você finalizou esse exercício.',
                placement: 'top',
                bgColor: 'green.700'
            });

            navigation.navigate('history');

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message: 'Não foi possível registrar o exercício selecionado.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });
        }finally{
            setSendingRegister(false);
        }
    };

    useEffect(()=>{
        fetchExerciseDetails();
    },[exerciseId]);

    return(
        <VStack flex={1}>
            <ScrollView>

                <VStack px={8} bg={"gray.600"} pt={12}>
                    <TouchableOpacity onPress={handleGoBack} >
                        <Icon 
                            as={Feather}
                            name={"arrow-left"}
                            color={"green.500"}
                            size={6}
                        />
                    </TouchableOpacity>

                    <HStack justifyContent={"space-between"} mt={4} mb={8} alignItems="center" >
                        <Heading color={"gray.100"} fontSize={'lg'} flexShrink={1} fontFamily={"heading"} >
                            {exercise.name}
                        </Heading>

                        <HStack alignItems={"center"} >
                            <Ionicons name="ios-body-outline" size={16} color="#C4C4CC" />
                            <Text color="gray.200" ml={1} textTransform='capitalize' >
                                {exercise.group}
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>

                {isLoading ? <Loading/> :

                    <VStack p={8}>

                    <Box rounded={"lg"} overflow={"hidden"}>
                        <Image
                            w={'full'}
                            h={80}
                            source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                            alt={"Nome"}
                            mb={3}
                            resizeMode={"cover"}                                 
                        />
                    </Box>

                    <Box bg={"gray.600"} rounded={"md"} pb={4} px={4}>
                        <HStack justifyContent={"space-around"} alignItems={"center"} mb={6} mt={5}>
                            <HStack >
                                <FontAwesome5 name="dumbbell" size={24} color="#00875F" />
                                <Text color={"gray.200"} ml={2}>{exercise.series} séries</Text>
                            </HStack>

                            <HStack >
                                <Ionicons name="repeat" size={24} color={"#00875F"} />
                                <Text color={"gray.200"} ml={2}>{exercise.repetitions} Repetições</Text>
                            </HStack>
                        </HStack>

                        <Button 
                            title='Marcar como realizado'
                            isLoading={sendingRegister}
                            onPress={handleExercisehistoryRegister}
                        />
                    </Box>
                    </VStack>
                
                }
                
            </ScrollView>
        </VStack>
    );
};