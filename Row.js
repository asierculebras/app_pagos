import React from 'react';
import { View, Text, StyleSheet, FlatList} from 'react-native';

const Row = (props) => (
  <View style={styles.container}>
   <View style={[styles.box, styles.box2]}>
      <FlatList 
            data={[
              {key:props.nombre,},
            ]}
            renderItem={({item}) => <Text>{item.key}</Text>}
          />
    </View>
    <View style={[styles.box]}>
      <FlatList 
            data={[
              {key:props.cantidad,},
            ]}
            renderItem={({item}) => <Text>{item.key}</Text>}
          />
    </View>
    <View style={[styles.box, styles.box3]}>
      <FlatList 
            data={[
              {key:props.precio,},
            ]}
            renderItem={({item}) => <Text>{item.key}</Text>}
          />
    </View>
    
  </View>
);





/*
<Text style={styles.text}>
      {`${props.nombre}`}
    </Text>

    <Text >
      {`${props.nombre} ${" ("}${props.cantidad} ${") "} ${"...... "} ${props.precio + "€"}  `}
    </Text>


    <View style={styles.row}>
            <View style={[styles.box, styles.box2]}></View>
            <View style={[styles.box]}></View>
            <View style={[styles.box, styles.box3]}></View>
          </View>




    */



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
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
});

export default Row;