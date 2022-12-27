import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'native-base';
import { MaterialIcons, FontAwesome5,MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import { Image, Platform } from 'react-native';

import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';
import { History } from '@screens/History';
import { Exercise } from '@screens/Exercise';

import homeSvg from '@assets/home.png';
import historySvg from '@assets/history.png';
import profileSvg from '@assets/profile.png';
import { color } from 'native-base/lib/typescript/theme/styled-system';
import colors from 'native-base/lib/typescript/theme/base/colors';


type AppRoutes = {
    home: undefined,
    exercise: {exerciseId: string},
    profile: undefined,
    history: undefined,
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes(){
    const { sizes, colors } = useTheme();

    const iconSize = sizes[2];

    return(
        <Navigator screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.green[500],
            tabBarInactiveTintColor: colors.gray[200],
            tabBarStyle:{
                backgroundColor: colors.gray[600],
                borderTopWidth: 0,
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: sizes[10],
                paddingTop: sizes[6]
            }
            }}
        >
            <Screen 
                name={'home'}
                component={Home}
                options={{ 
                    tabBarIcon: ({ color}) =>
                    <Icon
                        as={MaterialIcons}
                        name={'home'}
                        size={iconSize}
                        color={color}
                    />
                    
                }}
            />

            <Screen 
                name={'history'}
                component={History}
                options={{ 
                    tabBarIcon: ({ color}) =>
                    <Icon
                        as={MaterialCommunityIcons}
                        name={'history'}
                        size={iconSize}
                        color={color}
                    />
                }}
            />

            <Screen 
                name={'profile'}
                component={Profile}
                options={{ 
                    tabBarIcon: ({ color}) =>
                    <Icon
                        as={FontAwesome5}
                        name={'user'}
                        size={iconSize}
                        color={color}
                    />
                }}
            />

            <Screen 
                name={'exercise'}
                component={Exercise}
                options={{ tabBarButton: () => null}}
            />
        </Navigator>
    )
}