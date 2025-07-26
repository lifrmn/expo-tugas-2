import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Daftar 10 Ikon:</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        <AntDesign name="stepforward" size={30} color="black" />
        <AntDesign name="stepbackward" size={30} color="black" />
        <Entypo name="500px" size={30} color="black" />
        <Entypo name="aircraft" size={30} color="black" />
        <EvilIcons name="bell" size={30} color="black" />
        <EvilIcons name="calendar" size={30} color="black" />
        <Feather name="activity" size={30} color="black" />
        <Feather name="airplay" size={30} color="black" />
        <FontAwesome name="heart" size={30} color="black" />
        <FontAwesome name="star" size={30} color="black" />
      </View>
    </ScrollView>
  );
}
