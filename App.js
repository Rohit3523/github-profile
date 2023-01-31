import * as React from 'react';
import { Text, View, Image, TextInput, ScrollView, Pressable, ToastAndroid, BackHandler, Dimensions, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get("window");

function Profile({ data, repo, setScreen }){
  return (
    <>
      <Pressable style={styles.header} onPress={()=> setScreen("home")}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.headertext}>User Profile</Text>
      </Pressable>
      <ScrollView style={styles.profilearea} showsVerticalScrollIndicator={false}>
        <View style={styles.profilehead}>
          <Image source={{ uri: data.avatar_url }} style={styles.profilepic}/>
          <View style={{ marginLeft: 15, width: width - 150 }}>
            <Text style={[styles.name, { fontSize: 25, fontWeight: 'bold' }]}>{data.name}</Text>
            <Text style={[styles.name, { fontSize: 18 }]}>{data.login}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.infotext}>{data.followers} Follower</Text>
          <Text style={styles.infotext}>{data.following} Following</Text>
          <Text style={styles.infotext}>{data.public_repos} Repositories</Text>
        </View>
        <View style={{ width: '100%', height: '100%', marginTop: 20 }}>
        {
          repo.map((x)=>{
            return (
              <View style={styles.repo_box}>
                <Text style={[styles.repo_name, { fontSize: 24 }]}>{x.name}</Text>
                { x.description ? <Text style={[styles.repo_name, { fontSize: 16, marginTop: 5 }]}>{x.description}</Text> : null }
                <Text style={[styles.infotext, { marginTop: 10 }]}>Create on: {(new Date(x.created_at)).toLocaleString()}</Text>
              
                <View style={styles.info}>
                  <Text style={styles.infotext}>{x.private ? "Private" : "Public"} Repo</Text>
                  <Text style={styles.infotext}>{x.forks} Fork</Text>
                  <Text style={styles.infotext}>{x.open_issues} Issue{x.open_issues > 1 ? "s" : ''}</Text>
                </View>
              </View>
            )
          })
        }
        </View>
      </ScrollView>
    </>
  )
}

export default function App() {
  let [screen, setScreen] = React.useState("home");
  let [username, setUsername] = React.useState("");
  let [profile, setProfile] = React.useState({});
  let [repo, setRepo] = React.useState([]);

  React.useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', function () {
      if(screen == "profile"){
        setScreen("home");
        return true;
      }else{
        return false;
      }
    });
  }, [screen]);

  async function search(){
    setProfile({});
    setRepo([]);

    if(username.length == 0) return;
    let data = await fetch(`https://api.github.com/users/${username}`);
        data = await data.json();

    if(data?.message){
      ToastAndroid.show(data.message, ToastAndroid.SHORT);
    }else{
      let repo = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
          repo = await repo.json();
          
      setProfile(data);
      setRepo(repo);
      
      setScreen("profile");
    }
  }

  return (
    <View style={styles.container}>
      {
        (screen == 'home') ? (
          <>
            <Text style={styles.paragraph}>
              Search Github User
            </Text>
            <View style={styles.search}>
              <Text style={styles.searchusername}>Username</Text>
              <TextInput
                placeholder={"Enter Github Username"}
                placeholderTextColor='#ffffff'
                style={styles.textinput}
                value={username}
                onChangeText={(text)=> setUsername(text)}
              />
              <Pressable style={styles.button} onPress={()=>{ search() }}>
                <Text style={styles.buttontext}>Search</Text>
              </Pressable>
            </View>
          </>
        ) : screen == "profile" ? (
          <Profile data={profile} repo={repo} setScreen={setScreen}/> 
        ) : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#161b22',
    padding: 8,
  },

  header: {
    flexDirection: 'row',
    padding: 10,
  },
  headertext: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10
  },

  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  search: {

  },
  searchusername: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  textinput: {
    marginTop: 10,
    borderColor: '#ffffff',
    height: 40,
    padding: 2,
    backgroundColor: '#0d1117',
    color: '#ffffff',
    paddingLeft: 10,
    borderRadius: 5
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    height: 40,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttontext:{
    fontWeight: 'bold',
    fontSize: 18
  },

  profilearea: {
    marginTop: 5
  },
  profilehead: {
    flexDirection: 'row',
    marginTop: 10,
    width: '95%',
    alignSelf: 'center'
  },
  profilepic: {
    height: 100,
    width: 100,
    borderRadius: 10
  },
  name: {
    color: '#ffffff'
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20
  },
  infotext: {
    color: '#ffffff',
    fontWeight: 'bold'
  },

  repo_box: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginTop: 5,
    padding: 10
  },
  repo_name: {
    color: '#ffffff',
    flexWrap: 'wrap',
    fontWeight: 'bold'
  }
});
