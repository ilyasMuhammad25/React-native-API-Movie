/**
 * Created by chandra on 10/09/2018.
 */
import React from 'react';
import {View,StyleSheet,Text,ScrollView,ListView,Image,ImageBackground} from 'react-native';
import StyleBase from '../Utility/Style';
import Kategori from '../Utility/KategoriDashboard';

export default class Dashboard extends React.Component{
    static navigationOptions={
        header:null
    }
    render(){
        return(
            <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
                <View style={{marginBottom:20}}>
                    <Kategori navigation={this.props.navigation} title="now playing" url="now_playing"/>
                    <Kategori navigation={this.props.navigation} title="Up coming" url="upcoming"/>
                    <Kategori navigation={this.props.navigation} title="popular" url="popular"/>
                </View>
            </ScrollView>
        )
    }
}

const style=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:StyleBase.backgroundColor,
        padding:20
    }
})
