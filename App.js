import React from 'react';
import { StyleSheet, ActivityIndicator, ListView, Text, View, AppRegistry, Button} from 'react-native';

import { StackNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataJson: {} 
    }
  }

  componentWillMount() {
    return fetch('http://localhost:3000/url/1',{
      method: 'get',
      dataType: 'jsonp',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      //return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => {
        return response.json()
        
        })
      .then((responseData)=>{
        // AQUI HAGO COSAS
        this.setState({dataJson:responseData});
        this.setState({TokenDeCliente:responseData.TokenDeCliente});
        this.setState({ids_productos:responseData.ids_productos});
        this.setState({productos_totales:responseData.productos_totales });

        console.log("Este es JSON:");
        console.log(responseData);
        // No tengo que poner this.state.dataJson.Token.... por que ya lo he metido en el estado.
        console.log("Este es TOKEN:");
        console.log(this.state.TokenDeCliente);
        console.log("Este son los productos:");
        console.log(this.state.productos_totales);



      }).catch(function(err){console.log(err)});
  
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      (this.state.dataJson.precio === undefined) ?
      (<View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>) :(<View style={{flex: 1, paddingTop: 20}}>

        <Text> Aqui deberia ir un imputText para pner la url</Text>
        <Text> Y que el Component willMount se haga con esa url</Text>
        <Text> El precio es: {this.state.dataJson.precio}</Text>

        <Button
          onPress={() => navigate('List', { user: 'Lucy' , dataJson: this.state.dataJson })}
          title="Ir a productos"
          color= 'purple'
        />

      </View>)
    );
  }
}

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Productos',
  });
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Chat with {params.user}</Text>
        <Text> El precio es: {params.dataJson.precio}</Text>
        <Button
          onPress={() => navigate('Pago', { user: 'Lucy', TokenDeCliente: params.dataJson.TokenDeCliente  })}
          title="Ir a pagar"
          color= 'purple'
        />
      </View>
    );
  }
}

class PayScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pago',
  });
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>Chat with {params.user}</Text>
        <Text> el token es: {params.TokenDeCliente} </Text>
      </View>
    );
  }
}




const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  List: { screen: ListScreen },
  Pago: { screen: PayScreen },
});

AppRegistry.registerComponent('SimpleApp', () => SimpleApp);