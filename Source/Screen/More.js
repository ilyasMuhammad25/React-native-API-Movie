/**
 * Created by chandra on 10/09/2018.
 */
import React from 'react';
import {View,Dimensions,Text,ScrollView,ListView,TouchableOpacity,ImageBackground,RefreshControl} from 'react-native';
import StyleBase from '../Utility/Style';

const {width,height}=Dimensions.get('window');
const ds= new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class More extends React.Component{
    static navigationOptions=({ navigation }) => ({

        title: navigation.state.params.title
        //title: 'Wiro Sableng: 212 Warrior'
    });
    constructor(props){
        super(props);

        this.state={
            nowPlaying:[],
            refresh:true,
            rowData:ds.cloneWithRows([]),
            pageData:[],
            page:1,
        }
    }
    async componentWillMount(){
        await this.getNowPlaying();
    }
    async getNowPlaying(){
        this.setState({refresh:true});
        await fetch(StyleBase.urlBase+'movie/'+this.props.navigation.state.params.url+'?api_key='+StyleBase.apiKey+'&language=en-US&page='+this.state.page+'&region=ID',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log("PAGE",this.state.page);
                //let b=responseJson.hasOwnProperty('results');
                console.log("LENGTH",responseJson.results)
                if(responseJson.results.length>1) {
                    this.setState({
                        page: this.state.page + 1,
                        pageData: this.state.pageData.concat(responseJson.results),
                        rowData: this.state.rowData.cloneWithRows(this.state.pageData.concat(responseJson.results)),
                        nowPlaying: responseJson.results,
                        refresh: false,
                    });
                }else{
                    this.setState({
                        refresh: false,
                    });
                }
            })
            .catch((error) => {
                //console.log(error);
            });
    }
    render(){
        return(
            <ListView
                contentContainerStyle={{flexWrap:'wrap',flexDirection: 'row',padding:10}}
                dataSource={this.state.rowData}
                renderRow={this.renderData}
                enableEmptySections={true}
                onEndReachedThreshold={500}
                onEndReached={() => {//console.log('fire');
                    console.log("PAGE",this.state.page)
                    this.getNowPlaying(); // keeps firing
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refresh}
                        onRefresh={()=>{this.setFirst.bind(this);this.getNowPlaying.bind(this)}}/>
                }
                /*onEndReached={this.onEndReached()}*/
            />

        )
    }
    setFirst(){
        this.setState({
            page:1,
            pageData:[],
            rowData:ds.cloneWithRows([]),
        });
    }
    renderData=(data)=>{



        let split = data.release_date.split('-');
        //let split = 2018;
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('DetailVideo', {
                movieId: data.id,
                title: data.original_title
            })}  style={{
                margin:5,
                backgroundColor: 'white',
                width: width*0.44,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5
            }}>
                <ImageBackground source={{uri: StyleBase.imageLite + data.poster_path}} resizeMode={'stretch'}
                                 style={{width: width*0.44, height: height*0.37}}>
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
    }
}
