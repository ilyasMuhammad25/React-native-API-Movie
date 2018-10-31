/**
 * Created by chandra on 10/09/2018.
 */
import React from 'react';
import {View,StyleSheet,Dimensions,Text,ScrollView,ListView,TouchableOpacity,ImageBackground,ActivityIndicator} from 'react-native';
import StyleBase from '../Utility/Style';
const {width,height}=Dimensions.get('window');
export default class KategoriDashboard extends React.Component{
    constructor(props){
        super(props);
        const ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            nowPlaying:[],
            refresh:true
        }
    }
    async componentWillMount(){
        await this.getNowPlaying();
    }
    async getNowPlaying(){
        this.setState({refresh:true});
        await fetch(StyleBase.urlBase+'movie/'+this.props.url+'?api_key='+StyleBase.apiKey+'&language=en-US&page=1&region=ID',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.results)
                this.setState({nowPlaying: responseJson.results,refresh:false});
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render(){
        return(
            <View style={{marginBottom:10}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:0.5}}>
                        <Text style={style.txtTitle}>{this.props.title}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('More',{title:this.props.title,url:this.props.url})}} style={{flex:0.5,alignItems:'flex-end',justifyContent:'center'}}>
                        <Text style={[style.txtTitle,{fontSize:12,fontFamily:StyleBase.fontBasic,color:StyleBase.whiteBase,backgroundColor:StyleBase.colorBase,padding:5,borderRadius:3}]}>More >></Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{marginTop:10}}>
                    {this._rowRenderer()}
                </ScrollView>
            </View>
        )
    }
    _rowRenderer(){
        if(!this.state.refresh) {
            return this.state.nowPlaying.map((data, i) => {
                let split = data.release_date.split('-');
                return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailVideo', {
                        movieId: data.id,
                        title: data.original_title
                    })} key={i} style={{
                        marginRight: 10,
                        backgroundColor: 'white',
                        width: 200,
                        borderBottomRightRadius: 5,
                        borderBottomLeftRadius: 5
                    }}>
                        <ImageBackground source={{uri: StyleBase.imageLite + data.poster_path}} resizeMode={'stretch'}
                                         style={{width: 200, height: 270}}>
                            <Text style={{
                                backgroundColor: StyleBase.colorBase,
                                padding: 5,
                                color: StyleBase.whiteBase,
                                width: 40,
                                fontFamily: StyleBase.fontBasic,
                                textAlign: 'center'
                            }}>{data.vote_average}</Text>
                        </ImageBackground>
                        <View style={{minHeight: 10}}>
                            <Text style={{
                                padding: 5,
                                textAlign: 'center',
                                fontFamily: StyleBase.fontBasic
                            }}>{data.original_title + "\n(" + split[0] + ")"}</Text>
                        </View>

                    </TouchableOpacity>
                )
            })
        }else{
            return(
                <View style={{alignItems:'center',justifyContent:'center',alignContent:'center'}}>
                    <ActivityIndicator size="large" color={StyleBase.colorGreen} />
                </View>
            )
        }

    }
}
const style=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:StyleBase.backgroundColor,
        padding:20
    },
    txtTitle:{
        fontFamily:StyleBase.font,
        fontSize:17,
        color:StyleBase.fontColorTitle
    }
})