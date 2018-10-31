/**
 * Created by chandra on 10/09/2018.
 */
import React from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,ImageBackground,ActivityIndicator} from 'react-native';
import StyleBase from '../Utility/Style';
import YouTube from 'react-native-youtube'
export default class DetailVideo extends React.Component{
    static navigationOptions=({ navigation }) => ({

        title: navigation.state.params.title
        //title: 'Wiro Sableng: 212 Warrior'
    });
    constructor(props){
        super(props);
        this.state={
            title:this.props.navigation.state.params.title,
            movieId:this.props.navigation.state.params.movieId,
            //title:"Wiro Sableng: 212 Warrior",
            //movieId:472918,
            results:[],
            height:0,
            detail:[],
            genres:[],
            similar:[],
            refresh:true,
            recomend:[]
        }
    }
    async componentWillMount(){
        await this.getVideo();
        await this.getDetail();
        await this.getSimilar();
        await this.getRecomend();
    }
    getRecomend(){//console.log("SIMILAR")
        fetch(StyleBase.urlBase+'movie/'+this.state.movieId+'/recommendations?api_key='+StyleBase.apiKey+'&language=en-US',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                this.setState({recomend: responseJson.results,refresh:false});
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getSimilar(){//console.log("SIMILAR")
        fetch(StyleBase.urlBase+'movie/'+this.state.movieId+'/similar?api_key='+StyleBase.apiKey+'&language=en-US',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                this.setState({similar: responseJson.results,refresh:false});
            })
            .catch((error) => {
                console.log(error);
            });
    }
     getDetail(){
         fetch(StyleBase.urlBase+'movie/'+this.state.movieId+'?api_key='+StyleBase.apiKey+'&language=en-US',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                this.setState({detail: responseJson,genres:responseJson.genres});
            })
            .catch((error) => {
                console.log(error);
            });
    }
     getVideo(){
        this.setState({refresh:true});
         fetch(StyleBase.urlBase+'movie/'+this.state.movieId+'/videos?api_key='+StyleBase.apiKey+'&language=en-US',{method:'GET'})
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson.results[0])
                this.setState({results: responseJson.results[0],refresh:false});
            })
            .catch((error) => {
                console.log(error);
            });
    }
    handleReady = () => {
        setTimeout(() => this.setState({ height:200 }), 200);
    }
    renderYoutube(){
            if(this.state.refresh==false) {
                return (
                    <View style={{height:200}}>
                    <YouTube
                        apiKey={'AIzaSyBJntfg5QmvH_8cR-VAOJYqWngqH0kawhk'}
                        videoId={this.state.results.key}   // The YouTube video ID
                        play={false}             // control playback of video with true/false
                        fullscreen={false}       // control whether the video should play in fullscreen or inline
                        loop={true}             // control whether the video should loop when ended
                        controls={1}
                        onReady={this.handleReady}
                        onError={e => console.log(e)}

                        style={{alignSelf: 'stretch', height: this.state.height}}
                    />
                    </View>
                )
            }else{
                return(
                    <View style={{height:200}}/>
                )
            }


    }
    renderGenres(){

            return this.state.genres.map((data, i) => {
                return (
                    <View key={i} style={{backgroundColor:StyleBase.colorBase,padding:3,minWidth:20,marginRight:2}}>
                        <Text style={{fontFamily:StyleBase.fontDetail,color:'white'}}>{data.name}</Text>
                    </View>
                )
            });

    }
    render(){
        if(!this.state.refresh) {
            return (
                <ScrollView style={style.container}>
                    {this.renderYoutube()}
                    <View style={style.lay2}>
                        <View style={{flex: 0.8}}>
                            <Text style={style.txtTitle}>{this.state.detail.original_title}</Text>
                        </View>
                        <View style={{flex: 0.2, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                            <View style={{
                                backgroundColor: StyleBase.colorGreen,
                                width: 30,
                                padding: 3,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2
                            }}>
                                <Text style={style.vote}>{this.state.detail.vote_average}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{margin: 8, marginTop: 0}}>
                        <Text style={[style.title, {fontSize: 14}]}>{this.state.detail.overview}</Text>
                    </View>
                    <View style={{margin: 8, marginTop: 0, flexWrap: 'wrap', flexDirection: 'row'}}>
                        {this.renderGenres()}
                    </View>
                    <View style={{marginBottom:0,margin:10}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:0.5}}>
                                <Text style={style.txtTitle}>Recomendation movies</Text>
                            </View>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{marginTop:10}}>
                            {this._rowRenderer2()}
                        </ScrollView>
                    </View>
                    <View style={{marginBottom:0,margin:10}}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:0.5}}>
                                <Text style={style.txtTitle}>similar movies</Text>
                            </View>
                        </View>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{marginTop:10}}>
                            {this._rowRenderer()}
                        </ScrollView>
                    </View>
                </ScrollView>
            )
        }else{
            return(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator size="large" color={StyleBase.colorGreen} />
                </View>
            )
        }
    }
    updateState(title,movieId){
        this.setState({
            title:title,
            movieId:movieId
        });
    }
    _rowRenderer(){
        if(this.state.similar.length>0) {
            return this.state.similar.map((data, i) => {
                console.log(data);
                let split = data.release_date.split('-');
                return (
                    <TouchableOpacity onPress={() => {
                        /*this.setState({
                         title:data.original_title,
                         movieId:data.id
                         });*/
                        this.updateState(data.original_title, data.id);
                        setTimeout(
                            () => {
                                this.getVideo();
                                this.getDetail();
                                this.getSimilar();
                                this.getRecomend();
                            },
                            500
                        );

                        this.props.navigation.navigate('DetailVideo', {movieId: data.id, title: data.original_title});
                        this.setState({title: data.original_title, movieId: data.id})
                    }} key={i} style={{
                        marginRight: 2,
                        backgroundColor: 'white',
                        width: 200,
                        borderBottomRightRadius: 5,
                        borderBottomLeftRadius: 5
                    }}>
                        <ImageBackground source={{uri: StyleBase.imageBackdrop + data.backdrop_path}}
                                         resizeMode={'contain'} style={{width: 180, height: 100}}>
                            <Text style={{
                                backgroundColor: StyleBase.colorBase,
                                padding: 5,
                                color: StyleBase.whiteBase,
                                width: 40,
                                fontFamily: StyleBase.fontDetail,
                                textAlign: 'center'
                            }}>{data.vote_average}</Text>
                        </ImageBackground>
                        <View style={{minHeight: 10}}>
                            <Text style={{
                                padding: 5,
                                textAlign: 'center',
                                fontFamily: StyleBase.fontDetail
                            }}>{data.original_title + "\n(" + split[0] + ")"}</Text>
                        </View>

                    </TouchableOpacity>
                )
            })
        }else{
            return(
                <View>
                    <Text style={{fontFamily:StyleBase.fontDetail}}>no data can be displayed</Text>
                </View>
            )
        }
    }
    _rowRenderer2(){
        if(this.state.recomend.length>0){
            return this.state.recomend.map((data,i)=>{console.log(data);
                let split=data.release_date.split('-');
                return(
                    <TouchableOpacity onPress={()=>{
                        /*this.setState({
                         title:data.original_title,
                         movieId:data.id
                         });*/
                        this.updateState(data.original_title,data.id);
                        setTimeout(
                            () => {
                                this.getVideo();
                                this.getDetail();
                                this.getSimilar();
                            },
                            500
                        );

                        this.props.navigation.navigate('DetailVideo',{movieId:data.id,title:data.original_title});this.setState({title:data.original_title,movieId:data.id})
                    }} key={i} style={{marginRight:2,backgroundColor:'white',width:200,borderBottomRightRadius:5,borderBottomLeftRadius:5}}>
                        <ImageBackground source={{uri:StyleBase.imageLite+data.backdrop_path}} resizeMode={'contain'} style={{width:180,height:100}}>
                            <Text style={{backgroundColor:StyleBase.colorBase,padding:5,color:StyleBase.whiteBase,width:40,fontFamily:StyleBase.fontDetail,textAlign:'center'}}>{data.vote_average}</Text>
                        </ImageBackground>
                        <View style={{minHeight:10}}>
                            <Text style={{padding:5,textAlign:'center',fontFamily:StyleBase.fontDetail}}>{data.original_title+"\n("+split[0]+")"}</Text>
                        </View>

                    </TouchableOpacity>
                )
            })
        }else{
            return(
                <View>
                    <Text style={{fontFamily:StyleBase.fontDetail}}>no data can be displayed</Text>
                </View>
            )
        }
    }
}

const style=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    vote:{
        fontFamily:StyleBase.fontDetail,
        color:'white'
    },
    lay2:{
        margin:5,
        flexDirection:'row'
    },
    title:{
        fontFamily:StyleBase.fontDetail,
        fontSize:16
    },
    txtTitle:{
        fontFamily:StyleBase.fontDetail,
        fontSize:17,
        color:StyleBase.fontColorTitle
    }
})