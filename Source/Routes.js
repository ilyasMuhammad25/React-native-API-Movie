/**
 * Created by chandra on 10/09/2018.
 */
import {StackNavigator} from 'react-navigation';
import StyleBase from './Utility/Style';
import React from 'react';
import {View,StatusBar} from 'react-native';

import SplashScreen from './Screen/SplashScreen';
import Dashboard from './Screen/Dashboard';
import DetailVideo from './Screen/DetailVideo';
import More from './Screen/More';

const Routes=StackNavigator({
    SplashScreen:{screen:SplashScreen},
    Dashboard:{screen:Dashboard},
    DetailVideo:{screen:DetailVideo},
    More:{screen:More},
},{
    initialRouteName:'SplashScreen',
    navigationOptions:{
        headerStyle:{
            backgroundColor:StyleBase.colorBase
        },
        headerTintColor:StyleBase.whiteBase,
        headerTitleStyle:{
            fontFamily:'azoft-sans'
        }
    }
});

export default class Route extends React.Component{
    render(){
        return(
            <View style={{flex:1}}>
                <StatusBar backgroundColor={StyleBase.colorBase}/>
                <Routes/>
            </View>
        )
    }
}