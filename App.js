import React from 'react';
import { StyleSheet,Alert, FlatList,Image, ActivityIndicator, ListView, Text, View, AppRegistry, Button, TextInput, TouchableOpacity} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Braintree from 'react-native-braintree';

//import Braintree from 'react-native-braintree-xplat';

import QRCodeScanner from 'react-native-qrcode-scanner';

import Row from './Row';


class imputScreen extends React.Component {
  static navigationOptions = {
    title: 'Imput', 
  };
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  render() {
        const { navigate } = this.props.navigation;
    return (
      <View style={{padding: 10}}>
        <TextInput
          style={{height: 40}}
          placeholder="Type here your link"
          onChangeText={(text) => this.setState({text})}
          autoCorrect = {false}
          defaultValue='http://localhost:3000/url/'
        />
        <Text> </Text>
        <Button
          onPress={() => navigate('Home', { url: this.state.text})}
          title="Ir a productos"
          color= 'purple'
        />
        <Text> </Text>
        <Text> </Text>
        <Button
          onPress={() => navigate('Qr')}
          title="Ir a QR"
          color= 'grey'
        />
        <View style={{alignItems: 'center', marginTop:50}} >
         <Image 
          source={require('./img/foto.png')}
        />
        </View>
      </View>
    );
  }

}

class QrScreen extends React.Component {
  static navigationOptions = {
    title: 'QR',
  };
  constructor(props) {
      super(props);
      this.state = {
        text: ''
      };
    }

    aceptar(){
    // si pones .push pasa a la siguiente
    // si pones .repace la siguiete la pone como principal y no podras volver a atras
    console.log('Login acetado');
  }

  cancelar(){
    console.log('Login cancelado');
  }

  onSuccess(e) {
    const { navigate } = this.props.navigation;
      console.log("ESTO ES LO QUE SE HA CAPTURADO");
      console.log(e.data);
      this.setState({text: e.data});
      Alert.alert(
              'Captura QR',
              'Has capturado el QR con éxito: presiona el boton para continuar',
              [
                {
                  text:'Aceptar',
                  onPress: (this.aceptar.bind(this))
                },
                {
                  text: 'Cancelar',
                  onPress: (this.cancelar.bind(this))
                }
              ]
              )
        console.log('Has pulsado el boton');
  

       //navigate('Home', { url: this.state.text });
      //Linking.openURL(e.data).catch(err => console.error('An error occured', err));

    }

  render(){
    const { navigate } = this.props.navigation;
    return(
    <QRCodeScanner onRead = {this.onSuccess.bind(this)} bottomContent ={
              <TouchableOpacity style={styles.buttonTouchable} 
                  onPress={() => navigate('Home', { url: this.state.text})}>
                <Text style={styles.buttonText}>OK. Got it!</Text>
              </TouchableOpacity>}
            />

    );
  }
}


class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Comprobar',
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataJson: {},
      url: this.props.navigation.state.params.url
    }
  }
  componentWillMount() {

    //http://localhost:3000/url/1
    return fetch(this.state.url,{
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

        var clientToken = responseData.TokenDeCliente;
        Braintree.setup(clientToken)

      }).catch(function(err){console.log(err)});
  
  }

  /*
  let beautiful_datasource = [];
  Object.keys(objecto.productos_totales).forEach( key => {
    beautiful_datasource.push(objecto.productos_totales[key]); // instanacia del objecto
  });

  <ListView
    dataSource={beautiful_datasource}
  */
  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    console.log("las el texto pasado por props es: "); console.log(params.url);

    return (
      (this.state.dataJson.precio === undefined) ?
      (<View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>) :(<View style={{flex: 1, paddingTop: 20}}>


        <Text style={styles.comprobar} > La url que escribiste es: </Text>
        <Text style={styles.espacio}></Text>
        <Text style={styles.negrita} > {params.url} </Text>
        <Text> </Text>
        <Text> </Text>
        <Text style={styles.comprobar} > El precio es: <Text style={styles.dinero}> {this.state.dataJson.precio}</Text> €</Text>
        <Text> </Text>
        <Button
          onPress={() => navigate('List', {  dataJson: this.state.dataJson , url: this.state.url })}
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
    url: '',
    precio: 0,
    dataJson: {},
  });
componentDidMount() {
  const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
  this.setState({url:this.props.navigation.state.params.url} );
  this.setState({precio:this.props.navigation.state.params.dataJson.precio} );
  this.setState({dataJson:this.props.navigation.state.params.dataJson} );
}
bppp() {
  const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;
    var url = this.state.url;
    var precio = this.state.precio;
    console.log("LA URL en bppp"); console.log(this.state.url);
    Braintree.showPaymentViewController(this)
              .then(function(nonce) {

                    console.log("LA URL: ");
                    console.log(url);
                    console.log("El AMOUNT/PRECIO: ");
                    console.log(precio);
                  //callback after the user completes (or cancels) the flow.
                  //with the nonce, you can now pass it to your server to create a charge against the user's payment method
                  return fetch(url, {
                      method: "POST",
                      headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({payment_method_nonce: nonce,
                                            amount: precio
                                             })
                  })      
              })
              .then((xxx) => navigate('Pago', { precio: params.dataJson.precio , url: this.state.url }))
              .catch(
                (xxx) => navigate('List', { dataJson: this.state.dataJson , url: this.state.url })
                //function(err) {
                //console.error("---------------- ERROR 1 --->", err)
                //}
              );
}



  constructor(props) {
    super(props);

    let beautiful_datasource = [];
    console.log("this.props.navigation.state.dataJson"); console.log(this.props.navigation.state.params.dataJson);
    var  productos_totales = this.props.navigation.state.params.dataJson["productos_totales"];

    Object.keys(productos_totales).map( key => {
      beautiful_datasource.push(productos_totales[key]); // esto tiene un array con los json de los productos dentro.
    });

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(beautiful_datasource),
      url: this.props.navigation.state.params.url
    };
  }



  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    // simplemente recordativo
    let beautiful_datasource = [];
    var  productos_totales = params.dataJson["productos_totales"];
    Object.keys(productos_totales).map( key => {
      beautiful_datasource.push(productos_totales[key]); // instanacia del objecto
    });
    console.log("el beautiful_datasource es :" );
    console.log(beautiful_datasource);
 

    return (
      <View>
      <View style={styles.container}>
              <View style={[styles.box, styles.box2]}>
              <FlatList 
                    data={[
                      {key:'Nombre',},
                    ]}
                    renderItem={({item}) => <Text style={{fontSize: 20}}>{item.key}</Text>}
                  />
            </View>
            <View style={[styles.box]}>
              <FlatList 
                    data={[
                      {key:'Cantidad',},
                    ]}
                    renderItem={({item}) => <Text style={{fontSize: 20}}>{item.key}</Text>}
                  />
            </View>
            <View style={[styles.box, styles.box3]}>
              <FlatList 
                    data={[
                      {key:'Precio',},
                    ]}
                    renderItem={({item}) => <Text style={{fontSize: 20}}>{item.key}</Text>}
                  />
             </View>
   </View>
    

      <ListView style={{marginTop: 3, marginBottom: 3}}
        dataSource={this.state.dataSource}
        renderRow={(data) => <Row {...data} />}
      />
        <Text> </Text>
        <Text style={{textAlign: 'center'}}> El precio total es: </Text>
        <Text style={{color: 'blue',fontSize: 30, textAlign: 'center',marginLeft: 40}}> {params.dataJson.precio} €</Text>

        <Button
          onPress={() => this.bppp()}
          title="Ir a pagar " 
          color='purple'
        />
      </View>
    );
  }
/*
<Button
          onPress={() => navigate('Pago', { user: 'Lucy', precio: params.dataJson.precio , url: this.state.url })}
          title="Ir a pagar " 
          color= 'purple'
        />
*/ 
}

class PayScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pago',
    backButton: 'hidden',
  })
componentDidMount() {
  
  }

  render() {
    const { params } = this.props.navigation.state;
    const { navigate } = this.props.navigation;

    return (

      <View style={styles.containerP}>
        <Text style={styles.title}> ¡¡Enhorabuena!! </Text>
        <Text></Text>
        <Text> Has realizado correctamente el pago</Text>
        <Text></Text>
        <Text> Pago total de : <Text style={styles.dinero}>{params.precio} € </Text> </Text>
        <Text></Text>
        <Button
          onPress={() => navigate('Input')}
          title="Inicio"
          color= 'purple'
        />
      </View>
    );
  }


}




const app_qr = StackNavigator({
  Input: {screen: imputScreen},
  Home: { screen: HomeScreen },
  List: { screen: ListScreen },
  Pago: { screen: PayScreen },
  Qr: { screen: QrScreen },
});


const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comprobar: {
    textAlign: 'center',
    fontSize: 16,
  },
  negrita: {
    fontSize: 19,
    textAlign: 'center',
    color: 'blue',
  },
  espacio: {
    fontSize: 5,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  row: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  box: {
    flex: 1,
    alignItems: 'center',
  },
  box2: {
    alignItems: 'center',
  },
  box3: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
  containerP: {
      flex: 1,
      alignItems: 'center', // nos lo centra horizontalemnte
      //justifyContent: 'center', // nos lo pone en el centro verticalmente
  },
    title:{
      marginTop: 100,
      fontSize:25
  },
     dinero:{
      marginTop: 100,
      fontSize:25,
      color: 'rgb(0,122,255)',
  },
});

AppRegistry.registerComponent('app_qr', () => app_qr);


