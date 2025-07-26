import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎨 Daftar 10 Ikon Populer:</Text>

      <View style={styles.iconGrid}>
        <AntDesign name="stepforward" size={40} color="#e91e63" />
        <AntDesign name="stepbackward" size={40} color="#3f51b5" />
        <Entypo name="500px" size={40} color="#009688" />
        <Entypo name="aircraft" size={40} color="#9c27b0" />
        <EvilIcons name="bell" size={40} color="#ff9800" />
        <EvilIcons name="calendar" size={40} color="#4caf50" />
        <Feather name="activity" size={40} color="#00bcd4" />
        <Feather name="airplay" size={40} color="#673ab7" />
        <FontAwesome name="heart" size={40} color="#f44336" />
        <FontAwesome name="star" size={40} color="#ffc107" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f0f0f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 30,
    columnGap: 30,
  },
});
