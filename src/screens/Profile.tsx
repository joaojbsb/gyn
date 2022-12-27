import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Center, Skeleton, VStack, ScrollView, Text, Heading, useToast } from 'native-base';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import  defaultUserPhotoImg from '@assets/userPhotoDefault.png';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    old_password: string;
};

const profileSchema = yup.object({
    name: yup
        .string()
        .required('Informe o nome.'),
    password: yup
        .string()
        .min(6, 'A senha deve possuir no mínimo 6 digitos.')
        .nullable()
        .transform((value=> !!value? value: null)),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value=> !!value? value: null))
        .oneOf([yup.ref('password'), null])
        .when('password', {
            is:(Field: any) => Field,
            then: yup
                .string()
                .nullable()
                .required('Informe a confirmação da senha.')
                .transform((value)=> !!value? value: null)
        })
});


export function Profile(){
    const [ photoIsLoading, setPhotoIsLoading ] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const PHOTO_SIZE = 33;

    const toast = useToast();
    const { user,updateUserProfile } = useAuth();
    const { control, handleSubmit, formState:{errors} } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema),
    });

    async function handleUserPhotoSelect(){
        try {
            setPhotoIsLoading(true)
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality:1,
                aspect:[4,4],
                allowsEditing: true
            });
    
            if (photoSelected.canceled) {
                return
            }; 

            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)

                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5 ) {
                    return toast.show({
                        title:'Essa imagem é muito grande. Escolha uma de até 5mb.',
                        placement: 'top',
                        bgColor:'red.500'
                    })
                }

                //retornar a extensão da imagem
                const fileExtension = photoSelected.assets[0].uri.split('.').pop();
                
                const photoFile = {
                    name: `${user.name}.${fileExtension}`.toLowerCase().replace(' ',''),
                    uri: photoSelected.assets[0].uri,
                    type: `${photoSelected.assets[0].type}/${fileExtension}`
                } as any;
                
                const userPhotoUploadForm = new FormData();
                userPhotoUploadForm.append('avatar', photoFile);

                const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm,{
                    headers:{
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const userUpdated = user;
                userUpdated.avatar = avatarUpdatedResponse.data.avatar;

                updateUserProfile(userUpdated);
                console.log(userUpdated)

                toast.show({
                    title:'Foto atualizada.',
                    placement: 'top',
                    bgColor:'green.500'

                });


            }

        } catch (error) {
            console.log(error);
        }finally{
            setPhotoIsLoading(false);
        }
    };

    async function handleProfileUpdate(data: FormDataProps){
        try {
            setIsUpdating(true);

            const userUpdate = user;
            userUpdate.name = data.name;

            await api.put('/users', data);

            toast.show({
                title: 'Atualizado com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });

            await updateUserProfile(userUpdate);

        } catch (error) {

            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message: 'Não foi possível atualizar o registro. Tente mais tarde.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            });

        }finally{
            setIsUpdating(false);
        }
    };    

    return(
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />

            <ScrollView contentContainerStyle={{paddingBottom: 56}} >
                <Center mt={6} px={10} >

                {  photoIsLoading ?
                    <Skeleton 
                        w={PHOTO_SIZE} 
                        h={PHOTO_SIZE} 
                        rounded="full" 
                        startColor={"gray.500"}
                        endColor={"gray.400"}
                    />
                    :
                    <UserPhoto 
                        source={user.avatar 
                        ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                        : defaultUserPhotoImg}
                        alt={"Foto do usuario"}
                        size={PHOTO_SIZE}                        
                    />  
                }     
                    <TouchableOpacity onPress={handleUserPhotoSelect} >
                        <Text color={"green.500"} fontWeight={"bold"} fontSize={"md"} mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity> 
                    
                    <Controller 
                        control={control}
                        name='name'
                        render={({field:{value,onChange}})=>(
                            <Input 
                                placeholder='Nome' 
                                bg={"gray.600"} 
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='email'
                        render={({field:{value,onChange}})=>(
                            <Input 
                                placeholder='E-mail' 
                                bg={"gray.600"} 
                                isDisabled 
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    
                    

                </Center>

                <VStack px={10} mt={12} mb={9}>
                    <Heading fontFamily={"heading"} color={"gray.200"} fontSize="md" mb={2} alignSelf='flex-start'>
                        Alterar Senha
                    </Heading>

                    <Controller 
                        control={control}
                        name='old_password'
                        render={({field:{value,onChange}})=>(
                        <Input
                            bg={"gray.600"}
                            placeholder={"Senha antiga"}
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.old_password?.message}
                        />
                        )}
                    />

                    <Controller 
                        control={control}
                        name='password'
                        render={({field:{value,onChange}})=>(
                        <Input
                            bg={"gray.600"}
                            placeholder={"Senha nova"}
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.password?.message}
                        />
                        )}
                    /> 

                    <Controller 
                        control={control}
                        name='confirm_password'
                        render={({field:{value,onChange}})=>(
                        <Input
                            bg={"gray.600"}
                            placeholder={"Confirmar senha"}
                            secureTextEntry
                            onChangeText={onChange}
                            errorMessage={errors.confirm_password?.message}
                        />
                        )}
                    />

                    <Button 
                        title='Atualizar' 
                        mt={4} 
                        onPress={handleSubmit(handleProfileUpdate)} 
                        isLoading={isUpdating}
                    />
                </VStack>

            </ScrollView>
        </VStack>
    );
};